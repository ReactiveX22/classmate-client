"use client";

import { AiReasoningIndicator } from "@/components/ai/ai-reasoning-indicator";
import { AiStreamingBubble } from "@/components/ai/ai-streaming-bubble";
import type { ToolIndicator } from "@/components/ai/ai-tool-indicator";
import { AiToolIndicator } from "@/components/ai/ai-tool-indicator";
import { Button } from "@/components/ui/button";
import {
  Message,
  MessageAction,
  MessageActions,
  MessageContent,
} from "@/components/ui/chat/message";
import type { AiMessage } from "@/lib/api/services/ai.service";
import { cn, copyToClipboard } from "@/lib/utils";
import { Copy, Pencil } from "lucide-react";
import { AnimatePresence } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

type PersistedToolCall = {
  name: string;
};

interface AiMessageListProps {
  messages: AiMessage[];
  streamingContent: string;
  streamingReasoning: string;
  activeTools?: ToolIndicator[];
  isStreaming: boolean;
}

export function AiMessageList({
  messages,
  streamingContent,
  streamingReasoning,
  activeTools,
  isStreaming,
}: AiMessageListProps) {
  const tools = activeTools ?? [];
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);

  async function handleCopy(content: string, messageId: string) {
    try {
      await copyToClipboard(content);
      setCopiedMessageId(messageId);
      toast.success("Message copied");
      window.setTimeout(
        () =>
          setCopiedMessageId((current) =>
            current === messageId ? null : current,
          ),
        1500,
      );
    } catch {
      toast.error("Could not copy message");
    }
  }

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
    <div className="flex w-full flex-col space-y-10">
      {messages.map((message, index) => {
        const isAssistant = message.role === "assistant";
        const isLastMessage = index === messages.length - 1;
        const persistedTools =
          isStreaming && isLastMessage
            ? []
            : Array.isArray(message.metadata?.toolCalls)
              ? (message.metadata.toolCalls as PersistedToolCall[]).map(
                  (tool, idx) => ({
                    id: `${message.id}-tool-${idx}`,
                    name: tool.name,
                    status: "finishing" as const,
                  }),
                )
              : [];

        const persistedReasoning =
          typeof message.metadata?.reasoning === "string"
            ? message.metadata.reasoning
            : "";

        return (
          <div key={message.id}>
            <Message
              className="group/message mx-auto flex w-full max-w-200 px-0 md:px-6"
              role={message.role}
            >
              {isAssistant ? (
                <div className="group flex w-full flex-col gap-0">
                  {persistedTools.length > 0 && (
                    <div className="mb-3">
                      <AiToolIndicator tools={persistedTools} />
                    </div>
                  )}
                  <AiReasoningIndicator reasoning={persistedReasoning} />
                  <MessageContent
                    markdown
                    className="chat-markdown text-foreground flex-1 max-w-none rounded-lg bg-transparent p-0 text-base leading-7"
                  >
                    {message.content}
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
                        onClick={() => handleCopy(message.content, message.id)}
                        aria-label="Copy message"
                      >
                        {copiedMessageId === message.id ? (
                          <Copy className="text-emerald-500" />
                        ) : (
                          <Copy />
                        )}
                      </Button>
                    </MessageAction>
                  </MessageActions>
                </div>
              ) : (
                <div className="group flex w-full flex-col items-end gap-1">
                  <MessageContent className="max-w-[85%] rounded-3xl bg-muted px-5 py-2.5 text-primary-foreground shadow-none sm:max-w-[75%]">
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
                    <MessageAction tooltip="Copy" delayDuration={100}>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full"
                        onClick={() => handleCopy(message.content, message.id)}
                        aria-label="Copy message"
                      >
                        {copiedMessageId === message.id ? (
                          <Copy className="text-emerald-500" />
                        ) : (
                          <Copy />
                        )}
                      </Button>
                    </MessageAction>
                  </MessageActions>
                </div>
              )}
            </Message>
          </div>
        );
      })}
      <AnimatePresence initial={false} mode="popLayout">
        {(isStreaming ||
          streamingContent ||
          streamingReasoning ||
          tools.length > 0) && (
          <AiStreamingBubble
            activeTools={tools}
            content={streamingContent}
            reasoning={streamingReasoning}
            isStreaming={isStreaming}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
