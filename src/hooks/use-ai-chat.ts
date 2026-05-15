'use client';

import { useCallback, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  AiConversation,
  AiMessage,
  streamChat,
} from '@/lib/api/services/ai.service';

interface UseAiChatOptions {
  conversationId: string;
  onTitleUpdate?: (conversation: AiConversation) => void;
}

interface AiChatState {
  messages: AiMessage[];
  streamingContent: string;
  streamingReasoning: string;
  activeTools: ToolIndicator[];
  isStreaming: boolean;
}

type ToolIndicator = {
  id: string;
  name: string;
  status: "running" | "finishing";
};

const TOOL_RUNNING_MIN_MS = 450;
const TOOL_FINISH_MIN_MS = 700;

const initialState: AiChatState = {
  messages: [],
  streamingContent: '',
  streamingReasoning: '',
  activeTools: [],
  isStreaming: false,
};

export function useAiChat({ conversationId, onTitleUpdate }: UseAiChatOptions) {
  const queryClient = useQueryClient();
  const abortRef = useRef<AbortController | null>(null);
  const flushFrameRef = useRef<number | null>(null);
  const pendingContentRef = useRef('');
  const pendingReasoningRef = useRef('');
  const toolStartTimesRef = useRef<Map<string, number>>(new Map());
  const toolTimersRef = useRef<Map<string, number>>(new Map());
  const isStreamingRef = useRef(false);
  const [state, setState] = useState<AiChatState>(initialState);

  const clearScheduledFlush = useCallback(() => {
    if (flushFrameRef.current !== null) {
      cancelAnimationFrame(flushFrameRef.current);
      flushFrameRef.current = null;
    }
  }, []);

  const flushPendingContent = useCallback(() => {
    clearScheduledFlush();

    if (!pendingContentRef.current) {
      return;
    }

    const nextContent = pendingContentRef.current;
    pendingContentRef.current = '';

    setState((current) => ({
      ...current,
      streamingContent: current.streamingContent + nextContent,
    }));
  }, [clearScheduledFlush]);

  const queueContentFlush = useCallback(() => {
    if (flushFrameRef.current !== null) {
      return;
    }

    flushFrameRef.current = requestAnimationFrame(() => {
      flushPendingContent();
    });
  }, [flushPendingContent]);

  const clearToolTimers = useCallback(() => {
    for (const timerId of toolTimersRef.current.values()) {
      window.clearTimeout(timerId);
    }

    toolTimersRef.current.clear();
    toolStartTimesRef.current.clear();
  }, []);

  const flushPendingReasoning = useCallback(() => {
    if (!pendingReasoningRef.current) {
      return;
    }

    setState((current) => ({
      ...current,
      streamingReasoning: current.streamingReasoning + pendingReasoningRef.current,
    }));
    pendingReasoningRef.current = '';
  }, []);

  const upsertToolIndicator = useCallback(
    (name: string, status: ToolIndicator["status"]) => {
      const now = Date.now();

      if (status === 'running' && !toolStartTimesRef.current.has(name)) {
        toolStartTimesRef.current.set(name, now);
      }

      if (status === 'finishing') {
        const startedAt = toolStartTimesRef.current.get(name) ?? now;
        const elapsed = now - startedAt;
        const delay = Math.max(0, TOOL_RUNNING_MIN_MS - elapsed) + TOOL_FINISH_MIN_MS;

        const existingTimer = toolTimersRef.current.get(name);
        if (existingTimer !== undefined) {
          window.clearTimeout(existingTimer);
        }

        const timerId = window.setTimeout(() => {
          setState((current) => {
            const existingIndex = current.activeTools.findIndex(
              (tool) => tool.name === name,
            );

            if (existingIndex < 0) {
              return current;
            }

            const nextTools = [...current.activeTools];
            nextTools[existingIndex] = {
              ...nextTools[existingIndex],
              status,
            };

            return {
              ...current,
              activeTools: nextTools,
            };
          });

          toolTimersRef.current.delete(name);
        }, delay);

        toolTimersRef.current.set(name, timerId);
        return;
      }

      setState((current) => {
        const existingIndex = current.activeTools.findIndex(
          (tool) => tool.name === name,
        );

        if (existingIndex >= 0) {
          const nextTools = [...current.activeTools];
          nextTools[existingIndex] = {
            ...nextTools[existingIndex],
            status,
          };

          return {
            ...current,
            activeTools: nextTools,
          };
        }

        return {
          ...current,
          activeTools: [
            ...current.activeTools,
            {
              id: `${name}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
              name,
              status,
            },
          ],
        };
      });
    },
    [],
  );

  const sendMessage = useCallback(
    async (message: string) => {
      const trimmedMessage = message.trim();

      if (!trimmedMessage || isStreamingRef.current) {
        return;
      }

      abortRef.current?.abort();

      const controller = new AbortController();
      abortRef.current = controller;

      isStreamingRef.current = true;
      setState((current) => ({
        ...current,
        messages: [],
        streamingContent: '',
        streamingReasoning: '',
        activeTools: [],
        isStreaming: true,
      }));
      pendingContentRef.current = '';
      pendingReasoningRef.current = '';
      clearScheduledFlush();
      clearToolTimers();

      try {
        for await (const event of streamChat(
          {
            message: trimmedMessage,
            conversationId,
          },
          controller.signal,
        )) {
          switch (event.type) {
            case 'title_updated':
              onTitleUpdate?.(event.payload);
              break;

            case 'user_message':
              queryClient.setQueryData(
                ['ai', 'conversations', conversationId],
                (old: { conversation: unknown; messages: AiMessage[] } | undefined) => {
                  if (!old) return old;
                  return {
                    ...old,
                    messages: [...old.messages, event.payload],
                  };
                },
              );
              break;

            case 'content':
              pendingContentRef.current += event.payload.delta;
              queueContentFlush();
              break;

            case 'reasoning':
              pendingReasoningRef.current += event.payload.delta;
              setState((current) => ({
                ...current,
                streamingReasoning: current.streamingReasoning + event.payload.delta,
              }));
              break;

            case 'tool':
              if (event.payload.status === 'start') {
                upsertToolIndicator(event.payload.name, 'running');
              } else {
                upsertToolIndicator(event.payload.name, 'finishing');
              }
              break;

            case 'final':
              flushPendingContent();
              flushPendingReasoning();
              const finalMessage = {
                ...event.payload,
                metadata: {
                  ...event.payload.metadata,
                  reasoning: event.payload.metadata?.reasoning,
                },
              };
              isStreamingRef.current = false;
              queryClient.setQueryData(
                ['ai', 'conversations', conversationId],
                (old: { conversation: unknown; messages: AiMessage[] } | undefined) => {
                  if (!old) return old;
                  return {
                    ...old,
                    messages: [...old.messages, finalMessage],
                  };
                },
              );
              setState((current) => ({
                ...current,
                streamingContent: '',
                streamingReasoning: '',
                isStreaming: false,
              }));
              break;

            case 'error':
              flushPendingContent();
              flushPendingReasoning();
              isStreamingRef.current = false;
              toast.error('AI Error', {
                description: event.payload.message,
              });
              setState((current) => ({
                ...current,
                streamingContent: '',
                streamingReasoning: '',
                activeTools: [],
                isStreaming: false,
              }));
              break;
          }
        }
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          flushPendingContent();
          flushPendingReasoning();
          isStreamingRef.current = false;
          toast.error('Connection lost', {
            description: 'Please try again.',
          });
          setState((current) => ({
            ...current,
            streamingContent: '',
            streamingReasoning: '',
            activeTools: [],
            isStreaming: false,
          }));
        }
      } finally {
        if (abortRef.current === controller) {
          abortRef.current = null;
        }
      }
    },
    [
      clearScheduledFlush,
      clearToolTimers,
      conversationId,
      flushPendingContent,
      flushPendingReasoning,
      onTitleUpdate,
      queueContentFlush,
      queryClient,
      upsertToolIndicator,
    ],
  );

  const abort = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    flushPendingContent();
    flushPendingReasoning();
    clearToolTimers();
    isStreamingRef.current = false;

    setState((current) => ({
      ...current,
      streamingReasoning: '',
      activeTools: [],
      isStreaming: false,
    }));
  }, [clearToolTimers, flushPendingContent, flushPendingReasoning]);

  const loadConversation = useCallback(
    (messages: AiMessage[]) => {
      clearScheduledFlush();
      clearToolTimers();
      pendingContentRef.current = '';
      pendingReasoningRef.current = '';
      setState({
        messages,
        streamingContent: '',
        streamingReasoning: '',
        activeTools: [],
        isStreaming: false,
      });
    },
    [clearScheduledFlush, clearToolTimers],
  );

  const resetConversation = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    clearScheduledFlush();
    clearToolTimers();
    pendingContentRef.current = '';
    pendingReasoningRef.current = '';
    isStreamingRef.current = false;

    setState(initialState);
  }, [clearScheduledFlush, clearToolTimers]);

  return {
    ...state,
    sendMessage,
    abort,
    loadConversation,
    resetConversation,
  };
}
