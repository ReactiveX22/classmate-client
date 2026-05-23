"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { AiInputBar } from "@/components/ai/ai-input-bar";
import { AiMessageList } from "@/components/ai/ai-message-list";
import {
  ChatContainerContent,
  ChatContainerRoot,
  ChatContainerScrollAnchor,
} from "@/components/ui/chat/chat-container";
import { Loader } from "@/components/ui/chat/loader";
import { ScrollButton } from "@/components/ui/chat/scroll-button";
import { useAiChat } from "@/hooks/use-ai-chat";
import { useAiConversation } from "@/hooks/use-ai-conversation";
import { AiConversation } from "@/lib/api/services/ai.service";
import { ScrollArea } from "../ui/scroll-area";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { TaskPanel } from "./task-panel";

interface AiChatPageProps {
  convId: string;
  autoMessage?: string | null;
}

export function AiChatPage({ convId, autoMessage }: AiChatPageProps) {
  const queryClient = useQueryClient();
  const autoSentRef = useRef(false);

  const handleTitleUpdate = useCallback(
    (conversation: AiConversation) => {
      queryClient.setQueryData(
        ["ai", "conversations"],
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

  const handleTaskToolEnd = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["todos"] });
  }, [queryClient]);

  const {
    messages: streamingMessages,
    streamingContent,
    streamingReasoning,
    activeTools,
    isStreaming,
    isRetrying,
    lastError,
    sendMessage,
    retry,
    abort,
    resetConversation,
  } = useAiChat({ conversationId: convId, onTitleUpdate: handleTitleUpdate, onTaskToolEnd: handleTaskToolEnd });

  const conversationQuery = useAiConversation(convId);

  const baseMessages = conversationQuery.data?.messages ?? [];
  const displayMessages = (() => {
    const baseIds = new Set(baseMessages.map((m) => m.id));
    const newStreaming = streamingMessages.filter((m) => !baseIds.has(m.id));
    return [...baseMessages, ...newStreaming];
  })();

  const lastMessage = displayMessages[displayMessages.length - 1];
  const hasOrphanedUserMessage =
    !conversationQuery.isLoading &&
    displayMessages.length > 0 &&
    lastMessage?.role === "user" &&
    !isStreaming &&
    !lastError;

  const displayError =
    lastError ??
    (hasOrphanedUserMessage
      ? { message: "Failed to get a response. Please try again." }
      : null);

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const scrollAnchorRef = useRef<HTMLDivElement>(null);
  const [isNearBottom, setIsNearBottom] = useState(true);

  const scrollToBottom = useCallback((smooth = false) => {
    const viewport = scrollAreaRef.current;
    if (!viewport) return;
    setIsNearBottom(true);
    viewport.scrollTo({
      top: viewport.scrollHeight,
      behavior: smooth ? "smooth" : "auto",
    });
  }, []);

  useEffect(() => {
    const el = scrollAreaRef.current;
    if (!el) return;

    const handleScroll = () => {
      const atBottom = el.scrollHeight - el.scrollTop <= el.clientHeight + 50;
      setIsNearBottom(atBottom);
    };

    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!isNearBottom) return;

    const el = scrollAreaRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [displayMessages.length, streamingContent, isNearBottom]);

  useEffect(() => {
    if (!convId) {
      resetConversation();
      return;
    }

    if (!conversationQuery.data) {
      return;
    }

    queryClient.setQueryData(
      ["ai", "conversations"],
      (currentData: { conversations: AiConversation[] } | undefined) => {
        const conversations = currentData?.conversations ?? [];
        const exists = conversations.some((item) => item.id === convId);
        if (exists) return currentData;
        return {
          conversations: [
            conversationQuery.data.conversation,
            ...conversations,
          ],
        };
      },
    );
  }, [convId, conversationQuery.data, resetConversation, queryClient]);

  useEffect(() => {
    if (autoMessage && !autoSentRef.current && !isStreaming) {
      autoSentRef.current = true;
      sendMessage(autoMessage);
    }
  }, [autoMessage, isStreaming, sendMessage]);

  useEffect(() => {
    if (!conversationQuery.error) {
      return;
    }

    toast.error("Unable to load conversation", {
      description: "Please try opening the chat again.",
    });
  }, [conversationQuery.error]);

  const handleSend = (message: string) => {
    return sendMessage(message);
  };

  return (
    <ResizablePanelGroup
      orientation="horizontal"
      className="h-[calc(100vh-64px)] w-full bg-background"
    >
      <ResizablePanel defaultSize={75} minSize={50}>
        <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
          <ScrollArea ref={scrollAreaRef} className="h-[calc(100vh-64px)]">
            <div className="relative min-h-0 flex-1">
              <ChatContainerRoot className="min-h-0 flex-1 pb-28">
                <ChatContainerContent className="px-4 py-12">
                  {conversationQuery.isLoading ? (
                    <div className="flex min-h-[40vh] items-center justify-center px-4 text-center">
                      <Loader variant="bars" />
                    </div>
                  ) : displayMessages.length === 0 ? (
                    <div className="flex min-h-[40vh] items-center justify-center px-4 text-center">
                      <p className="text-muted-foreground">
                        Start typing to continue your conversation.
                      </p>
                    </div>
                  ) : (
                    <AiMessageList
                      activeTools={activeTools}
                      error={displayError}
                      isStreaming={isStreaming}
                      messages={displayMessages}
                      onRetry={retry}
                      streamingContent={streamingContent}
                      streamingReasoning={streamingReasoning}
                    />
                  )}
                  <ChatContainerScrollAnchor
                    ref={scrollAnchorRef}
                    className="mb-4"
                  />
                </ChatContainerContent>
              </ChatContainerRoot>
            </div>
          </ScrollArea>

          <div className="pointer-events-none absolute left-1/2 bottom-5 z-10 w-full max-w-200 -translate-x-1/2 px-3 md:px-5">
            <div className="relative">
              <div className="pointer-events-auto absolute -top-12 left-0 flex w-full justify-end pr-2">
                <ScrollButton
                  className="shadow-sm"
                  isNearBottom={isNearBottom}
                  onScrollToBottom={scrollToBottom}
                />
              </div>
              <div className="pointer-events-auto">
                <AiInputBar
                  isRetrying={isRetrying}
                  isStreaming={isStreaming}
                  onSend={handleSend}
                  onStop={abort}
                />
              </div>
            </div>
          </div>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={25} minSize={20}>
        <TaskPanel />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
