"use client";

import { IconListCheck, IconX } from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TaskList } from "@/components/task-sheet/task-list";
import { useTodos } from "@/hooks/use-todos";
import { cn } from "@/lib/utils";

interface TaskSidebarProps {
  expanded: boolean;
  onToggle: () => void;
}

const TASK_SIDEBAR_WIDTH = 256;
const TASK_RAIL_WIDTH = 48;

export function TaskSidebar({ expanded, onToggle }: TaskSidebarProps) {
  const { data } = useTodos({ limit: 50 });
  const count = data?.data?.length ?? 0;

  return (
    <div
      data-slot="task-sidebar"
      className={cn(
        "relative z-10 flex h-full shrink-0 flex-col border-l bg-background transition-[width] duration-200 ease-linear",
        expanded ? "overflow-hidden" : "overflow-hidden",
      )}
      style={{ width: expanded ? TASK_SIDEBAR_WIDTH : TASK_RAIL_WIDTH }}
    >
      {expanded ? (
        <>
          <div className="flex items-center justify-between border-b px-3 py-2">
            <div className="flex items-center gap-2">
              <IconListCheck className="size-4 text-muted-foreground" />
              <h2 className="text-sm font-semibold">Tasks</h2>
              {count > 0 && (
                <Badge variant="secondary" className="h-4 text-[10px]">
                  {count}
                </Badge>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={onToggle}
              className="size-6"
            >
              <IconX className="size-3.5" />
            </Button>
          </div>
          <div className="min-h-0 flex-1 overflow-auto">
            <TaskList />
          </div>
        </>
      ) : (
        <button
          onClick={onToggle}
          className="flex h-full w-full flex-col items-center gap-1.5 pt-3 transition-colors hover:bg-accent/50"
        >
          <IconListCheck className="size-4 text-muted-foreground" />
          <span
            className="select-none text-[10px] font-medium text-muted-foreground"
            style={{ writingMode: "vertical-rl" }}
          >
            Tasks
          </span>
          {count > 0 && (
            <Badge variant="secondary" className="h-4 text-[10px]">
              {count}
            </Badge>
          )}
        </button>
      )}
    </div>
  );
}
