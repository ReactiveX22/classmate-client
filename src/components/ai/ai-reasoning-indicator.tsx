"use client";

import { Brain, ChevronDown } from "lucide-react";

import { ResponseStream } from "@/components/ui/chat/response-stream";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

interface AiReasoningIndicatorProps {
  reasoning: string;
  isStreaming?: boolean;
  className?: string;
}

export function AiReasoningIndicator({
  reasoning,
  isStreaming = false,
  className,
}: AiReasoningIndicatorProps) {
  if (!reasoning) {
    return null;
  }

  return (
    <Collapsible className={cn("mb-3", className)}>
      <CollapsibleTrigger className="flex w-fit items-center gap-1.5 text-left text-sm text-muted-foreground transition-colors hover:text-foreground">
        <Brain className="size-4 shrink-0 text-current" />
        {isStreaming ? (
          <span className="bg-[linear-gradient(to_right,var(--muted-foreground)_40%,var(--foreground)_60%,var(--muted-foreground)_80%)] bg-size-[200%_auto] bg-clip-text font-medium text-transparent animate-[shimmer_4s_infinite_linear]">
            Thinking...
          </span>
        ) : (
          <span>Thinking completed</span>
        )}
        <ChevronDown className="size-4 shrink-0 transition-transform duration-200 data-[state=open]:rotate-180" />
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-2 rounded-lg border border-border bg-muted/50 p-3 text-sm text-muted-foreground">
        <ResponseStream
          textStream={reasoning}
          className="text-muted-foreground prose-p:leading-relaxed prose-pre:p-2 prose-xs"
        />
      </CollapsibleContent>
    </Collapsible>
  );
}
