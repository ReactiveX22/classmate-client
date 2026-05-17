"use client";

import { Wrench, ChevronDown } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

export type ToolIndicator = {
  id: string;
  name: string;
  status: "running" | "finishing";
};

interface AiToolIndicatorProps {
  tools: ToolIndicator[];
  className?: string;
}

function getToolLabel(name: string) {
  const normalized = name.toLowerCase();

  const toolMappings: Record<string, { running: string; finished: string }> = {
    get_classroom_posts: {
      running: "Scanning classroom stream...",
      finished: "Classroom stream updated",
    },
    list_user_classrooms: {
      running: "Loading your classrooms...",
      finished: "Classrooms synchronized",
    },
    get_upcoming_deadlines: {
      running: "Checking upcoming deadlines...",
      finished: "Deadlines updated",
    },
    rag_search: {
      running: "Searching your course materials...",
      finished: "Materials retrieved",
    },
    web_search: {
      running: "Searching the web...",
      finished: "Search results ready",
    },
    grade_assignment: {
      running: "Grading submission...",
      finished: "Submission graded",
    },
  };

  if (toolMappings[normalized]) {
    return toolMappings[normalized];
  }

  // Fallback for unknown tools
  return {
    running: `Running ${name}...`,
    finished: `Completed ${name}`,
  };
}

function ToolStatusText({ tool }: { tool: ToolIndicator }) {
  const labels = getToolLabel(tool.name);
  if (tool.status === "running") {
    return (
      <span className="bg-[linear-gradient(to_right,var(--muted-foreground)_40%,var(--foreground)_60%,var(--muted-foreground)_80%)] bg-size-[200%_auto] bg-clip-text font-medium text-transparent animate-[shimmer_4s_infinite_linear]">
        {labels.running}
      </span>
    );
  }

  return <span>{labels.finished}</span>;
}

export function AiToolIndicator({ tools, className }: AiToolIndicatorProps) {
  if (tools.length === 0) {
    return null;
  }

  if (tools.length === 1) {
    return (
      <div
        className={cn(
          "flex items-start gap-2 text-sm text-muted-foreground",
          className,
        )}
      >
        <Wrench className="mt-0.5 size-4 shrink-0 text-current" />
        <ToolStatusText tool={tools[0]} />
      </div>
    );
  }

  return (
    <Collapsible className={cn("px-0 py-0", className)}>
      <CollapsibleTrigger className="flex w-fit items-center gap-1.5 text-left text-sm text-muted-foreground transition-colors hover:text-foreground">
        <Wrench className="size-4 shrink-0 text-current" />
        <span>{tools.length} tool calls</span>
        <ChevronDown className="size-4 shrink-0 transition-transform duration-200 data-[state=open]:rotate-180" />
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-2 space-y-2 pl-5">
        {tools.map((tool) => (
          <div
            className="flex items-start gap-2 rounded-xl px-0 py-1 text-sm text-muted-foreground"
            key={tool.id}
          >
            <ToolStatusText tool={tool} />
          </div>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}
