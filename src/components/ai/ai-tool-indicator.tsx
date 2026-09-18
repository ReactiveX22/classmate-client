"use client";

import {
  Wrench,
  ChevronDown,
  Globe,
  Search,
  CheckSquare,
  FileText,
  GraduationCap,
  ClipboardList,
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

function getToolIcon(name: string): LucideIcon {
  const normalized = name.toLowerCase();

  if (normalized === "web_search") return Globe;
  if (normalized.startsWith("search_") || normalized === "rag_search")
    return Search;
  if (normalized.includes("task") || normalized.includes("deadline"))
    return CheckSquare;
  if (
    normalized.includes("notice") ||
    normalized.includes("post") ||
    normalized.includes("document")
  )
    return FileText;
  if (
    normalized.includes("class") ||
    normalized.includes("grade") ||
    normalized.includes("submission") ||
    normalized.includes("attendance")
  )
    return GraduationCap;
  if (normalized.includes("assignment")) return ClipboardList;

  return Wrench;
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
      running: "Searching the web for up-to-date info...",
      finished: "Web search complete",
    },
    grade_assignment: {
      running: "Grading submission...",
      finished: "Submission graded",
    },
    list_tasks: {
      running: "Fetching tasks...",
      finished: "Fetched tasks",
    },
    create_task: {
      running: "Creating task...",
      finished: "Task created",
    },
    update_task: {
      running: "Updating task...",
      finished: "Task updated",
    },
    delete_task: {
      running: "Deleting task...",
      finished: "Task deleted",
    },
    manage_tasks: {
      running: "Managing tasks...",
      finished: "Tasks managed",
    },
    get_organization_notices: {
      running: "Fetching notices...",
      finished: "Notices retrieved",
    },
    search_classroom_documents: {
      running: "Searching course materials...",
      finished: "Course materials found",
    },
    search_notice_documents: {
      running: "Searching notice archives...",
      finished: "Notice archives found",
    },
    get_classroom_post_by_id: {
      running: "Loading post details...",
      finished: "Post loaded",
    },
    get_assignment_submissions: {
      running: "Fetching submissions...",
      finished: "Submissions loaded",
    },
    get_attendances: {
      running: "Loading attendance records...",
      finished: "Attendance records loaded",
    },
    get_grades: {
      running: "Fetching grades...",
      finished: "Grades loaded",
    },
  };

  if (toolMappings[normalized]) {
    return toolMappings[normalized];
  }

  return {
    running: "Working...",
    finished: "Done",
  };
}

function ToolStatusText({ tool }: { tool: ToolIndicator }) {
  const labels = getToolLabel(tool.name);
  const Icon = getToolIcon(tool.name);

  if (tool.status === "running") {
    return (
      <div className="flex items-start gap-2 text-sm text-muted-foreground">
        <Icon className="mt-0.5 size-4 shrink-0 text-current" />
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
            className="rounded-xl px-0 py-1 text-sm text-muted-foreground"
            key={tool.id}
          >
            <ToolStatusText tool={tool} />
          </div>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}
