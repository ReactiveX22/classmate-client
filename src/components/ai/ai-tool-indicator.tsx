"use client";

import { useState } from "react";

import {
  Wrench,
  ChevronDown,
  Globe,
  Search,
  FileText,
  GraduationCap,
  CalendarClock,
  Megaphone,
  FileCheck,
  CalendarCheck,
  TrendingUp,
  ListChecks,
  LoaderCircle,
  CheckCheck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

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

type ToolLabel = {
  running: string;
  finished: string;
  icon: LucideIcon;
};

/**
 * One entry per tool the main agent can actually stream
 * (mirrors MainToolsRegistry in classmate-backend).
 * running = honest in-flight operation, finished = result-neutral outcome.
 * The client only knows a tool finished — never whether it found data —
 * so finished copy never claims success ("found"/"ready").
 * Icons: tasks use ListChecks (lucide cousin of the app's tabler
 * IconListCheck), grades/attendance reuse TrendingUp/CalendarCheck
 * already established elsewhere in the product.
 */
const toolMappings: Record<string, ToolLabel> = {
  list_user_classrooms: {
    running: "Looking up your classrooms...",
    finished: "Classrooms loaded",
    icon: GraduationCap,
  },
  get_classroom_posts: {
    running: "Checking what's been posted...",
    finished: "Posts loaded",
    icon: FileText,
  },
  get_classroom_post_by_id: {
    running: "Loading post details...",
    finished: "Post details loaded",
    icon: FileText,
  },
  get_upcoming_deadlines: {
    running: "Checking what's coming up...",
    finished: "Deadlines checked",
    icon: CalendarClock,
  },
  get_organization_notices: {
    running: "Checking for notices...",
    finished: "Notices loaded",
    icon: Megaphone,
  },
  get_assignment_submissions: {
    running: "Checking submissions...",
    finished: "Submissions loaded",
    icon: FileCheck,
  },
  get_attendances: {
    running: "Checking attendance records...",
    finished: "Attendance loaded",
    icon: CalendarCheck,
  },
  get_grades: {
    running: "Fetching grades...",
    finished: "Grades loaded",
    icon: TrendingUp,
  },
  search_classroom_documents: {
    running: "Searching your course materials...",
    finished: "Searched course materials",
    icon: Search,
  },
  search_notice_documents: {
    running: "Searching notice attachments...",
    finished: "Searched notice files",
    icon: Search,
  },
  web_search: {
    running: "Searching the web for up-to-date info...",
    finished: "Web search complete",
    icon: Globe,
  },
  manage_tasks: {
    running: "Working on your tasks...",
    finished: "Task request completed",
    icon: ListChecks,
  },
};

function getToolLabel(name: string): ToolLabel {
  return (
    toolMappings[name.toLowerCase()] ?? {
      running: "Working...",
      finished: "Done",
      icon: Wrench,
    }
  );
}

function ToolStatusText({ tool }: { tool: ToolIndicator }) {
  const labels = getToolLabel(tool.name);
  const Icon = labels.icon;

  if (tool.status === "running") {
    return (
      <div className="flex items-start gap-2 text-sm text-muted-foreground">
        <Icon className="mt-0.5 size-4 shrink-0 animate-pulse text-current motion-reduce:animate-none" />
        <span className="bg-[linear-gradient(to_right,var(--muted-foreground)_40%,var(--foreground)_60%,var(--muted-foreground)_80%)] bg-size-[200%_auto] bg-clip-text font-medium text-transparent animate-[shimmer_4s_infinite_linear]">
          {labels.running}
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-2 text-sm text-muted-foreground">
      <Icon className="mt-0.5 size-4 shrink-0 text-current" />
      <span>{labels.finished}</span>
    </div>
  );
}

export function AiToolIndicator({ tools, className }: AiToolIndicatorProps) {
  if (tools.length === 0) {
    return null;
  }

  if (tools.length === 1) {
    return (
      <div
        className={cn(
          "text-sm text-muted-foreground",
          className,
        )}
      >
        <ToolStatusText tool={tools[0]} />
      </div>
    );
  }

  return <MultiToolIndicator className={className} tools={tools} />;
}

function MultiToolIndicator({
  tools,
  className,
}: AiToolIndicatorProps) {
  const hasRunning = tools.some((tool) => tool.status === "running");
  // Live: open by default so running rows are watchable.
  // Settled: collapsed. A user toggle always wins over both.
  const [userOpen, setUserOpen] = useState<boolean | null>(null);
  const open = userOpen ?? hasRunning;

  return (
    <Collapsible
      className={cn("px-0 py-0", className)}
      open={open}
      onOpenChange={(next) => setUserOpen(next)}
    >
      <CollapsibleTrigger className="flex w-fit cursor-pointer items-center gap-1.5 text-left text-sm text-muted-foreground transition-colors hover:text-foreground">
        {hasRunning ? (
          <LoaderCircle className="size-4 shrink-0 animate-spin text-current motion-reduce:animate-none" />
        ) : (
          <CheckCheck className="size-4 shrink-0 text-current" />
        )}
        <span>{tools.length} checks</span>
        <ChevronDown className="size-4 shrink-0 transition-transform duration-200 data-[state=open]:rotate-180" />
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-1.5 space-y-1.5 pl-5">
        {tools.map((tool) => (
          <div className="text-sm text-muted-foreground" key={tool.id}>
            <ToolStatusText tool={tool} />
          </div>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}
