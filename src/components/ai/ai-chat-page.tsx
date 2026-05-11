"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

import { AiInputBar } from "@/components/ai/ai-input-bar";
import { AiMessageList } from "@/components/ai/ai-message-list";
import {
  ChatContainerContent,
  ChatContainerRoot,
} from "@/components/ui/chat/chat-container";
import { Loader } from "@/components/ui/chat/loader";
import { ScrollButton } from "@/components/ui/chat/scroll-button";
import { useAiChat } from "@/hooks/use-ai-chat";
import { useAiConversation } from "@/hooks/use-ai-conversation";
import { ScrollArea } from "../ui/scroll-area";
interface AiChatPageProps {
  initialConvId?: string;
}

export function AiChatPage({ initialConvId }: AiChatPageProps) {
  const router = useRouter();
  const activeConvId = initialConvId ?? "";
  const {
    conversation,
    messages,
    streamingContent,
    activeTools,
    isStreaming,
    sendMessage,
    abort,
    loadConversation,
    resetConversation,
  } = useAiChat();
  const conversationQuery = useAiConversation(activeConvId);

  useEffect(() => {
    if (!activeConvId) {
      resetConversation();
      return;
    }

    if (!conversationQuery.data) {
      return;
    }

    loadConversation(
      conversationQuery.data.conversation,
      conversationQuery.data.messages,
    );
  }, [
    activeConvId,
    conversationQuery.data,
    loadConversation,
    resetConversation,
  ]);

  useEffect(() => {
    if (!conversation?.id || initialConvId) {
      return;
    }

    router.replace(`/dashboard/ai/${conversation.id}`);
  }, [conversation?.id, initialConvId, router]);

  useEffect(() => {
    if (!conversationQuery.error) {
      return;
    }

    if (initialConvId) {
      router.replace("/dashboard/ai");
    }

    toast.error("Unable to load conversation", {
      description: "Please try opening the chat again.",
    });
  }, [conversationQuery.error, initialConvId, router]);

  const handleSend = (message: string) => {
    const conversationId = conversation?.id ?? activeConvId;

    return sendMessage(message, conversationId || undefined);
  };

  return (
    <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden bg-background">
      <ScrollArea className="h-[calc(100vh-56px)]">
        <div className="relative min-h-0 flex-1">
          <ChatContainerRoot className="min-h-0 flex-1 overflow-y-auto pb-28">
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
            <div className="absolute bottom-4 left-1/2 flex w-full max-w-4xl -translate-x-1/2 justify-end px-5">
              <ScrollButton className="shadow-sm" />
            </div>
          </ChatContainerRoot>
        </div>
      </ScrollArea>

      <div className="pointer-events-none absolute left-1/2 bottom-5 z-10 w-full max-w-3xl -translate-x-1/2 px-3 md:px-5">
        <div className="pointer-events-auto">
          <AiInputBar
            isStreaming={isStreaming}
            onSend={handleSend}
            onStop={abort}
            conversationId={conversation?.id}
            currentTitle={conversation?.title}
          />
        </div>
      </div>
    </div>
  );
}
