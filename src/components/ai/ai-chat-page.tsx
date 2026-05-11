"use client";

import { useEffect } from "react";
import { useQueryState } from "nuqs";
import { toast } from "sonner";

import { AiInputBar } from "@/components/ai/ai-input-bar";
import { AiMessageList } from "@/components/ai/ai-message-list";
import {
  ChatContainerRoot,
  ChatContainerContent,
} from "@/components/ui/chat/chat-container";
import { Loader } from "@/components/ui/chat/loader";
import { ScrollButton } from "@/components/ui/chat/scroll-button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAiChat } from "@/hooks/use-ai-chat";
import { useAiConversation } from "@/hooks/use-ai-conversation";

interface AiChatPageProps {
  initialConvId?: string;
}

export function AiChatPage({ initialConvId }: AiChatPageProps) {
  const [queryConvId, setQueryConvId] = useQueryState("convId");
  const activeConvId = initialConvId ?? queryConvId ?? "";
  const {
    conversation,
    messages,
    streamingContent,
    activeTools,
    isStreaming,
    sendMessage,
    abort,
    loadConversation,
  } = useAiChat();
  const conversationQuery = useAiConversation(activeConvId);

  useEffect(() => {
    if (!conversationQuery.data) {
      return;
    }

    loadConversation(
      conversationQuery.data.conversation,
      conversationQuery.data.messages,
    );
  }, [conversationQuery.data, loadConversation]);

  useEffect(() => {
    if (!conversation?.id || initialConvId || queryConvId === conversation.id) {
      return;
    }

    void setQueryConvId(conversation.id);
  }, [conversation?.id, initialConvId, queryConvId, setQueryConvId]);

  useEffect(() => {
    if (!conversationQuery.error) {
      return;
    }

    toast.error("Unable to load conversation", {
      description: "Please try opening the chat again.",
    });
  }, [conversationQuery.error]);

  const handleSend = (message: string) => {
    const conversationId = conversation?.id ?? activeConvId;

    return sendMessage(message, conversationId || undefined);
  };

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden bg-background">
      <div className="relative min-h-0 flex-1">
        <ChatContainerRoot className="h-full overflow-y-auto">
          <ChatContainerContent className="px-4 py-12">
            {conversationQuery.isLoading ? (
              <div className="flex min-h-[40vh] items-center justify-center px-4 text-center">
                <Loader variant="text-shimmer" />
              </div>
            ) : (
              <AiMessageList
                activeTools={activeTools}
                isStreaming={isStreaming}
                messages={messages}
                streamingContent={streamingContent}
              />
            )}
          </ChatContainerContent>
          <div className="absolute bottom-4 left-1/2 flex w-full max-w-3xl -translate-x-1/2 justify-end px-5">
            <ScrollButton className="shadow-sm" />
          </div>
        </ChatContainerRoot>
      </div>

      <div className="shrink-0 bg-background px-3 pb-3 md:px-5 md:pb-5">
        <div className="mx-auto max-w-3xl">
          <AiInputBar
            isStreaming={isStreaming}
            onSend={handleSend}
            onStop={abort}
          />
        </div>
      </div>
    </div>
  );
}
