"use client";

import { motion, type HTMLMotionProps } from "motion/react";

import { cn } from "@/lib/utils";
import { MessageContent } from "./message";

interface ResponseStreamProps extends HTMLMotionProps<"div"> {
  textStream: string;
  id?: string;
}

function ResponseStream({
  className,
  textStream,
  id,
  ...props
}: ResponseStreamProps) {
  return (
    <motion.div
      data-slot="response-stream"
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.16 }}
      className={cn(
        "prose prose-sm dark:prose-invert max-w-none wrap-break-word",
        "prose-p:my-2 prose-pre:my-3 prose-pre:overflow-x-auto prose-code:break-words",
        "prose-ul:my-2 prose-ol:my-2 prose-li:my-0.5",
        className,
      )}
      {...props}
    >
      <MessageContent
        markdown
        className="chat-markdown flex-1 max-w-none rounded-lg bg-transparent p-0"
        id={id}
      >
        {textStream}
      </MessageContent>
    </motion.div>
  );
}

export { ResponseStream };
