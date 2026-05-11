'use client';

import { useCallback, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  AiConversation,
  AiMessage,
  streamChat,
} from '@/lib/api/services/ai.service';

interface AiChatState {
  conversation: AiConversation | null;
  messages: AiMessage[];
  streamingContent: string;
  activeTools: ToolIndicator[];
  isStreaming: boolean;
}

type ToolIndicator = {
  name: string;
  status: "running" | "finishing";
};

const initialState: AiChatState = {
  conversation: null,
  messages: [],
  streamingContent: '',
  activeTools: [],
  isStreaming: false,
};

export function useAiChat() {
  const queryClient = useQueryClient();
  const abortRef = useRef<AbortController | null>(null);
  const flushFrameRef = useRef<number | null>(null);
  const pendingContentRef = useRef('');
  const toolRemovalTimersRef = useRef<Map<string, number>>(new Map());
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
    toolRemovalTimersRef.current.forEach((timer) => window.clearTimeout(timer));
    toolRemovalTimersRef.current.clear();
  }, []);

  const syncConversationInCache = useCallback(
    (conversation: AiConversation) => {
      setState((current) => ({
        ...current,
        conversation:
          current.conversation?.id === conversation.id
            ? conversation
            : current.conversation,
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
        activeTools: [],
        isStreaming: true,
      }));
      pendingContentRef.current = '';
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

            case 'tool':
              if (event.payload.status === 'start') {
                window.clearTimeout(
                  toolRemovalTimersRef.current.get(event.payload.name),
                );
                toolRemovalTimersRef.current.delete(event.payload.name);

                setState((current) => ({
                  ...current,
                  activeTools: current.activeTools.some(
                    (tool) => tool.name === event.payload.name,
                  )
                    ? current.activeTools.map((tool) =>
                        tool.name === event.payload.name
                          ? { ...tool, status: 'running' }
                          : tool,
                      )
                    : [
                        ...current.activeTools,
                        { name: event.payload.name, status: 'running' },
                      ],
                }));
              } else {
                setState((current) => ({
                  ...current,
                  activeTools: current.activeTools.map((tool) =>
                    tool.name === event.payload.name
                      ? { ...tool, status: 'finishing' }
                      : tool,
                  ),
                }));

                const timer = window.setTimeout(() => {
                  setState((current) => ({
                    ...current,
                    activeTools: current.activeTools.filter(
                      (tool) => tool.name !== event.payload.name,
                    ),
                  }));
                  toolRemovalTimersRef.current.delete(event.payload.name);
                }, 900);
                toolRemovalTimersRef.current.set(event.payload.name, timer);
              }
              break;

            case 'final':
              flushPendingContent();
              setState((current) => ({
                ...current,
                messages: [...current.messages, event.payload],
                streamingContent: '',
                activeTools: [],
                isStreaming: false,
              }));
              queryClient.invalidateQueries({
                queryKey: ['ai', 'conversations'],
              });
              break;

            case 'error':
              flushPendingContent();
              toast.error('AI Error', {
                description: event.payload.message,
              });
              setState((current) => ({
                ...current,
                streamingContent: '',
                activeTools: [],
                isStreaming: false,
              }));
              break;
          }
        }
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          flushPendingContent();
          toast.error('Connection lost', {
            description: 'Please try again.',
          });
          setState((current) => ({
            ...current,
            streamingContent: '',
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
      queueContentFlush,
      queryClient,
      state.isStreaming,
      syncConversationInCache,
    ],
  );

  const abort = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    flushPendingContent();
    clearToolTimers();

    setState((current) => ({
      ...current,
      activeTools: [],
      isStreaming: false,
    }));
  }, [clearToolTimers, flushPendingContent]);

  const loadConversation = useCallback(
    (conversation: AiConversation, messages: AiMessage[]) => {
      clearScheduledFlush();
      clearToolTimers();
      pendingContentRef.current = '';
      setState({
        conversation,
        messages,
        streamingContent: '',
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
