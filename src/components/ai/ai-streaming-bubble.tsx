"use client";

import { AiToolIndicator } from "@/components/ai/ai-tool-indicator";
import { Loader } from "@/components/ui/chat/loader";
import { Message } from "@/components/ui/chat/message";
import { ResponseStream } from "@/components/ui/chat/response-stream";
import { useSmoothStreamText } from "@/hooks/use-smooth-stream-text";
import { motion } from "motion/react";

interface AiStreamingBubbleProps {
  content: string;
  activeTools: { name: string; status: "running" | "finishing" }[];
  isStreaming: boolean;
}

export function AiStreamingBubble({
  content,
  activeTools,
  isStreaming,
}: AiStreamingBubbleProps) {
  const displayedContent = useSmoothStreamText({
    sourceText: content,
    enabled: isStreaming,
  });

  if (!isStreaming && !content && activeTools.length === 0) {
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
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 2 }}
              transition={{ duration: 0.16, ease: "easeOut" }}
            >
              {displayedContent ? (
                <ResponseStream textStream={displayedContent} />
              ) : (
                <Loader variant="typing" size="sm" />
              )}
            </motion.div>
            <AiToolIndicator className="mt-3" tools={activeTools} />
          </div>
        </div>
      </Message>
    </motion.div>
  );
}
