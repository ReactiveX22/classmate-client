"use client";

import { Brain } from "lucide-react";

import { AiStreamingBubble } from "@/components/ai/ai-streaming-bubble";
import type { ToolIndicator } from "@/components/ai/ai-tool-indicator";
import { AiToolIndicator } from "@/components/ai/ai-tool-indicator";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Message,
  MessageAction,
  MessageActions,
  MessageContent,
} from "@/components/ui/chat/message";
import type { AiMessage } from "@/lib/api/services/ai.service";
import { cn, copyToClipboard } from "@/lib/utils";
import { Copy, Pencil } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
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
        const persistedTools = Array.isArray(message.metadata?.toolCalls)
          ? (message.metadata.toolCalls as PersistedToolCall[]).map(
              (tool, idx) => ({
                id: `${message.id}-tool-${idx}`,
                name: tool.name,
                status: "finishing" as const,
              }),
            )
          : [];

        const persistedReasoning = typeof message.metadata?.reasoning === 'string'
          ? message.metadata.reasoning
          : '';

        return (
          <motion.div
            key={message.id}
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
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
                  {persistedReasoning && (
                    <Collapsible className="mb-3">
                      <CollapsibleTrigger className="flex w-fit items-center gap-1.5 text-left text-sm text-muted-foreground transition-colors hover:text-foreground">
                        <Brain className="size-4 shrink-0 text-current" />
                        <span>Thinking</span>
                        <svg
                          className="size-4 shrink-0 transition-transform duration-200 data-[state=open]:rotate-180"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="m6 9 6 6 6-6" />
                        </svg>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="mt-2 rounded-lg border border-border bg-muted/50 p-3 text-sm text-muted-foreground">
                        {persistedReasoning}
                      </CollapsibleContent>
                    </Collapsible>
                  )}
                  <MessageContent
                    markdown
                    className="chat-markdown text-foreground flex-1 max-w-none rounded-lg bg-transparent p-0"
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
          </motion.div>
        );
      })}
      <AnimatePresence initial={false} mode="popLayout">
        {(isStreaming || streamingContent || streamingReasoning || tools.length > 0) && (
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
