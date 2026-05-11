"use client";

import {
  Message,
  MessageAvatar,
  MessageContent,
} from "@/components/ui/chat/message";
import { Loader } from "@/components/ui/chat/loader";
import { ResponseStream } from "@/components/ui/chat/response-stream";
import { AiToolIndicator } from "@/components/ai/ai-tool-indicator";

interface AiStreamingBubbleProps {
  content: string;
  activeTools: string[];
  isStreaming: boolean;
}

export function AiStreamingBubble({
  content,
  activeTools,
  isStreaming,
}: AiStreamingBubbleProps) {
  if (!isStreaming && !content && activeTools.length === 0) {
    return null;
  }

  return (
    <Message
      className="mx-auto flex w-full max-w-4xl px-0 md:px-6"
      role="assistant"
    >
      <div className="flex w-full items-start gap-4">
        <MessageAvatar fallback="AI" />
        <MessageContent
          className="w-full max-w-none border-0 bg-transparent p-0 shadow-none"
        >
          {content ? (
            <ResponseStream textStream={content} />
          ) : (
            <Loader variant="typing" size="sm" />
          )}
          <AiToolIndicator className="mt-3" tools={activeTools} />
        </MessageContent>
      </div>
    </Message>
  );
}
