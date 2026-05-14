"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { AiInputBar } from "@/components/ai/ai-input-bar";
import { AiMessageList } from "@/components/ai/ai-message-list";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChatContainerContent,
  ChatContainerRoot,
  ChatContainerScrollAnchor,
} from "@/components/ui/chat/chat-container";
import { Loader } from "@/components/ui/chat/loader";
import { ScrollButton } from "@/components/ui/chat/scroll-button";
import { useAiChat } from "@/hooks/use-ai-chat";
import { useAiConversation } from "@/hooks/use-ai-conversation";
import { useUser } from "@/hooks/useAuth";
import { Role } from "@/types/auth";
import { IconSparkles } from "@tabler/icons-react";
import { ScrollArea } from "../ui/scroll-area";

interface AiChatPageProps {
  initialConvId?: string;
}

export function AiChatPage({ initialConvId }: AiChatPageProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: user } = useUser();
  const activeConvId = initialConvId ?? "";
  const {
    conversation,
    messages,
    streamingContent,
    streamingReasoning,
    activeTools,
    isStreaming,
    sendMessage,
    abort,
    loadConversation,
    resetConversation,
  } = useAiChat();
  const conversationQuery = useAiConversation(activeConvId);

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const scrollAnchorRef = useRef<HTMLDivElement>(null);
  const [isNearBottom, setIsNearBottom] = useState(true);

  const scrollToBottom = useCallback(() => {
    scrollAnchorRef.current?.scrollIntoView({ behavior: "auto" });
  }, []);

  useEffect(() => {
    const el = scrollAreaRef.current;
    if (!el) return;

    const checkScroll = () => {
      const atBottom = el.scrollHeight - el.scrollTop <= el.clientHeight + 50;
      setIsNearBottom(atBottom);
    };

    checkScroll();
    const interval = setInterval(checkScroll, 200);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
      setIsNearBottom(true);
    }
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (!activeConvId) {
      queryClient.setQueryData(["ai", "activeChatTitle"], null);
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
    queryClient.setQueryData(
      ["ai", "activeChatTitle"],
      conversationQuery.data.conversation.title,
    );
    queryClient.setQueryData(
      ["ai", "activeChatId"],
      conversationQuery.data.conversation.id,
    );
  }, [
    activeConvId,
    conversationQuery.data,
    loadConversation,
    resetConversation,
    queryClient,
  ]);

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
      <ScrollArea ref={scrollAreaRef} className="h-[calc(100vh-56px)]">
        <div className="relative min-h-0 flex-1">
          <ChatContainerRoot className="min-h-0 flex-1 overflow-y-auto pb-28">
            <ChatContainerContent className="px-4 py-12">
              {conversationQuery.isLoading ? (
                <div className="flex min-h-[40vh] items-center justify-center px-4 text-center">
                  <Loader variant="bars" />
                </div>
              ) : messages.length === 0 ? (
                <div className="flex min-h-[40vh] flex-col items-center justify-center px-4 text-center">
                  <Card className="max-w-2xl border-none bg-transparent shadow-none ring-0">
                    <CardHeader className="flex flex-col items-center gap-4 pb-2">
                      <Avatar size="lg" className="size-16">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          <IconSparkles className="size-8" />
                        </AvatarFallback>
                      </Avatar>
                      <CardTitle className="text-2xl">
                        Hi, I am ClassMate AI
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-center text-muted-foreground">
                      {user?.role === Role.Instructor
                        ? "I'm here to help you create courses, manage classes, grade assignments, and support your teaching workflow."
                        : "I'm here to help you with your studies, answer questions, explain concepts, and assist you with any learning needs."}
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <AiMessageList
                  activeTools={activeTools}
                  isStreaming={isStreaming}
                  messages={messages}
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
              isStreaming={isStreaming}
              onSend={handleSend}
              onStop={abort}
              conversationId={conversation?.id}
              currentTitle={conversation?.title}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
