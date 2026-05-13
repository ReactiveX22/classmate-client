"use client";

import { AiToolIndicator } from "@/components/ai/ai-tool-indicator";
import type { ToolIndicator } from "@/components/ai/ai-tool-indicator";
import { Loader } from "@/components/ui/chat/loader";
import { Message } from "@/components/ui/chat/message";
import { ResponseStream } from "@/components/ui/chat/response-stream";
import { useSmoothStreamText } from "@/hooks/use-smooth-stream-text";
import { motion } from "motion/react";

interface AiStreamingBubbleProps {
  content: string;
  activeTools?: ToolIndicator[];
  isStreaming: boolean;
}

export function AiStreamingBubble({
  content,
  activeTools,
  isStreaming,
}: AiStreamingBubbleProps) {
  const tools = activeTools ?? [];
  const displayedContent = useSmoothStreamText({
    sourceText: content,
    enabled: isStreaming,
  });
  const hasRunningTool = tools.some((tool) => tool.status === "running");

  if (!isStreaming && !content && tools.length === 0) {
    return null;
  }

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      initial={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
    >
      <Message
        className="mx-auto flex w-full max-w-200 px-0 md:px-6"
        role="assistant"
      >
        <div className="flex w-full items-start gap-4">
          <div className="w-full max-w-none border-0 bg-transparent p-0 shadow-none">
            <AiToolIndicator className="mt-3" tools={tools} />
            {!hasRunningTool && (
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 2 }}
                transition={{ duration: 0.16, ease: "easeOut" }}
              >
                {displayedContent ? (
                  <ResponseStream textStream={displayedContent} />
                ) : isStreaming ? (
                  <Loader className="mt-3" variant="typing" size="sm" />
                ) : null}
              </motion.div>
            )}
          </div>
        </div>
      </Message>
    </motion.div>
  );
}
