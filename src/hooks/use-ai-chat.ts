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
  activeTools: string[];
  isStreaming: boolean;
}

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
  const [state, setState] = useState<AiChatState>(initialState);

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
              setState((current) => ({
                ...current,
                streamingContent:
                  current.streamingContent + event.payload.delta,
              }));
              break;

            case 'tool':
              setState((current) => ({
                ...current,
                activeTools:
                  event.payload.status === 'start'
                    ? [...current.activeTools, event.payload.name]
                    : current.activeTools.filter(
                        (tool) => tool !== event.payload.name,
                      ),
              }));
              break;

            case 'final':
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
    [queryClient, state.isStreaming, syncConversationInCache],
  );

  const abort = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;

    setState((current) => ({
      ...current,
      activeTools: [],
      isStreaming: false,
    }));
  }, []);

  const loadConversation = useCallback(
    (conversation: AiConversation, messages: AiMessage[]) => {
      setState({
        conversation,
        messages,
        streamingContent: '',
        activeTools: [],
        isStreaming: false,
      });
    },
    [],
  );

  const resetConversation = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;

    setState(initialState);
  }, []);

  return {
    ...state,
    sendMessage,
    abort,
    loadConversation,
    resetConversation,
  };
}
