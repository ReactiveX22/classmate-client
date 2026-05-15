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
  onComplete?: (conversationId: string) => void;
}

interface AiChatState {
  conversation: AiConversation | null;
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
  conversation: null,
  messages: [],
  streamingContent: '',
  streamingReasoning: '',
  activeTools: [],
  isStreaming: false,
};

export function useAiChat({ onComplete }: UseAiChatOptions = {}) {
  const queryClient = useQueryClient();
  const abortRef = useRef<AbortController | null>(null);
  const flushFrameRef = useRef<number | null>(null);
  const pendingContentRef = useRef('');
  const pendingReasoningRef = useRef('');
  const toolStartTimesRef = useRef<Map<string, number>>(new Map());
  const toolTimersRef = useRef<Map<string, number>>(new Map());
  const conversationIdRef = useRef<string | null>(null);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;
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

  const syncConversationInCache = useCallback(
    (conversation: AiConversation) => {
      setState((current) => ({
        ...current,
        conversation,
      }));

      queryClient.setQueryData(
        ['ai', 'conversations'],
        (currentData: { conversations: AiConversation[] } | undefined) => {
          const conversations = currentData?.conversations ?? [];
          const exists = conversations.some(
            (item) => item.id === conversation.id,
          );

          return {
            conversations: exists
              ? conversations.map((item) =>
                  item.id === conversation.id ? conversation : item,
                )
              : [conversation, ...conversations],
          };
        },
      );
    },
    [queryClient],
  );

  const sendMessage = useCallback(
    async (message: string, conversationId?: string) => {
      const trimmedMessage = message.trim();

      if (!trimmedMessage || state.isStreaming) {
        return;
      }

      abortRef.current?.abort();

      const controller = new AbortController();
      abortRef.current = controller;

      setState((current) => ({
        ...current,
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
            case 'conversation':
              syncConversationInCache(event.payload);
              conversationIdRef.current = event.payload.id;
              break;

            case 'title_updated':
              syncConversationInCache(event.payload);
              break;

            case 'user_message':
              setState((current) => ({
                ...current,
                messages: [...current.messages, event.payload],
              }));
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
                  reasoning: state.streamingReasoning || event.payload.metadata?.reasoning,
                },
              };
              setState((current) => ({
                ...current,
                messages: [...current.messages, finalMessage],
                streamingContent: '',
                streamingReasoning: '',
                isStreaming: false,
              }));
              if (onCompleteRef.current && conversationIdRef.current) {
                onCompleteRef.current(conversationIdRef.current);
              }
              queryClient.invalidateQueries({
                queryKey: ['ai', 'conversations'],
              });
              break;

            case 'error':
              flushPendingContent();
              flushPendingReasoning();
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
      flushPendingContent,
      flushPendingReasoning,
      queueContentFlush,
      queryClient,
      state.isStreaming,
      state.streamingReasoning,
      syncConversationInCache,
      upsertToolIndicator,
    ],
  );

  const abort = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    flushPendingContent();
    flushPendingReasoning();
    clearToolTimers();

    setState((current) => ({
      ...current,
      streamingReasoning: '',
      activeTools: [],
      isStreaming: false,
    }));
  }, [clearToolTimers, flushPendingContent, flushPendingReasoning]);

  const loadConversation = useCallback(
    (conversation: AiConversation, messages: AiMessage[]) => {
      clearScheduledFlush();
      clearToolTimers();
      pendingContentRef.current = '';
      pendingReasoningRef.current = '';
      setState({
        conversation,
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
