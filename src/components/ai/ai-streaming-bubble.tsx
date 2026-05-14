"use client";

import { AiReasoningIndicator } from "@/components/ai/ai-reasoning-indicator";
import { AiToolIndicator } from "@/components/ai/ai-tool-indicator";
import type { ToolIndicator } from "@/components/ai/ai-tool-indicator";
import { Loader } from "@/components/ui/chat/loader";
import { Message } from "@/components/ui/chat/message";
import { ResponseStream } from "@/components/ui/chat/response-stream";
import { useSmoothStreamText } from "@/hooks/use-smooth-stream-text";
import { motion } from "motion/react";

interface AiStreamingBubbleProps {
  content: string;
  reasoning: string;
  activeTools?: ToolIndicator[];
  isStreaming: boolean;
}

export function AiStreamingBubble({
  content,
  reasoning,
  activeTools,
  isStreaming,
}: AiStreamingBubbleProps) {
  const tools = activeTools ?? [];
  const displayedContent = useSmoothStreamText({
    sourceText: content,
    enabled: isStreaming,
  });
  const displayedReasoning = useSmoothStreamText({
    sourceText: reasoning,
    enabled: isStreaming,
  });
  const hasRunningTool = tools.some((tool) => tool.status === "running");

  if (!isStreaming && !content && !reasoning && tools.length === 0) {
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
            <AiToolIndicator className="mb-5" tools={tools} />
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 2 }}
              transition={{ duration: 0.16, ease: "easeOut" }}
            >
              {displayedContent || displayedReasoning ? (
                <>
                  <AiReasoningIndicator reasoning={displayedReasoning} isStreaming />
                  {displayedContent ? (
                    <ResponseStream textStream={displayedContent} />
                  ) : !hasRunningTool ? (
                    <Loader className="mt-3" variant="typing" size="sm" />
                  ) : null}
                </>
              ) : isStreaming && !hasRunningTool ? (
                <Loader className="mt-3" variant="typing" size="sm" />
              ) : null}
            </motion.div>
          </div>
        </div>
      </Message>
    </motion.div>
  );
}
