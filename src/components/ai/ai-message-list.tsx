"use client";

import type { AiMessage } from "@/lib/api/services/ai.service";
import {
  Message,
  MessageAction,
  MessageActions,
  MessageAvatar,
  MessageContent,
} from "@/components/ui/chat/message";
import { ResponseStream } from "@/components/ui/chat/response-stream";
import { AiStreamingBubble } from "@/components/ai/ai-streaming-bubble";
import { Copy, Pencil, ThumbsDown, ThumbsUp, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AiMessageListProps {
  messages: AiMessage[];
  streamingContent: string;
  activeTools: string[];
  isStreaming: boolean;
}

export function AiMessageList({
  messages,
  streamingContent,
  activeTools,
  isStreaming,
}: AiMessageListProps) {
  if (messages.length === 0 && !isStreaming) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center px-4 text-center">
        <p className="max-w-sm text-sm text-muted-foreground">
          Ask a question about this classroom to start an AI conversation.
        </p>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col space-y-12">
      {messages.map((message, index) => {
        const isAssistant = message.role === "assistant";
        const isLastMessage = index === messages.length - 1;

        return (
          <Message
            className={cn(
              "mx-auto flex w-full max-w-3xl flex-col gap-2 px-0 md:px-6",
              isAssistant ? "items-start" : "items-end",
            )}
            key={message.id}
            role={message.role}
          >
            {isAssistant ? (
              <>
                <MessageAvatar fallback="AI" role="assistant" />
                <div className="group flex w-full flex-col gap-0">
                  <MessageContent className="text-foreground prose flex-1 rounded-lg bg-transparent p-0">
                    <ResponseStream textStream={message.content} />
                  </MessageContent>
                  <MessageActions
                    className={cn(
                      "-ml-2.5 flex gap-0 opacity-0 transition-opacity duration-150 group-hover/message:opacity-100",
                      isLastMessage && "opacity-100",
                    )}
                  >
                    <MessageAction tooltip="Copy" delayDuration={100}>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full"
                      >
                        <Copy />
                      </Button>
                    </MessageAction>
                    <MessageAction tooltip="Upvote" delayDuration={100}>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full"
                      >
                        <ThumbsUp />
                      </Button>
                    </MessageAction>
                    <MessageAction tooltip="Downvote" delayDuration={100}>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full"
                      >
                        <ThumbsDown />
                      </Button>
                    </MessageAction>
                  </MessageActions>
                </div>
              </>
            ) : (
              <div className="group flex flex-col items-end gap-1">
                <MessageContent className="max-w-[85%] rounded-3xl bg-primary px-5 py-2.5 text-primary-foreground shadow-none sm:max-w-[75%]">
                  {message.content}
                </MessageContent>
                <MessageActions className="flex gap-0 opacity-0 transition-opacity duration-150 group-hover/message:opacity-100">
                  <MessageAction tooltip="Edit" delayDuration={100}>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full"
                    >
                      <Pencil />
                    </Button>
                  </MessageAction>
                  <MessageAction tooltip="Delete" delayDuration={100}>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full"
                    >
                      <Trash />
                    </Button>
                  </MessageAction>
                  <MessageAction tooltip="Copy" delayDuration={100}>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full"
                    >
                      <Copy />
                    </Button>
                  </MessageAction>
                </MessageActions>
              </div>
            )}
          </Message>
        );
      })}
      <AiStreamingBubble
        activeTools={activeTools}
        content={streamingContent}
        isStreaming={isStreaming}
      />
    </div>
  );
}
