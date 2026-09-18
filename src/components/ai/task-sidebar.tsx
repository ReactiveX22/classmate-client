"use client";

import { useState } from "react";
import { IconLayoutSidebarRight, IconListCheck } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TaskList } from "@/components/task-sheet/task-list";
import { useTodos } from "@/hooks/use-todos";
import { cn } from "@/lib/utils";

export function TaskSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const { data } = useTodos({ limit: 50 });
  const count = data?.data?.length ?? 0;

  const toggle = () => setIsOpen((prev) => !prev);

  return (
    <div className="hidden shrink-0 md:flex">
      {/* Drawer — pushes chat content, slides in/out */}
      <div
        data-state={isOpen ? "open" : "closed"}
        className={cn(
          "shrink-0 overflow-hidden border-l bg-background transition-[width] duration-200 ease-linear",
          isOpen ? "w-80" : "w-0 border-l-0",
        )}
      >
        <div className="flex h-full w-80 flex-col">
          <div className="flex h-12 shrink-0 items-center gap-2 border-b px-3">
            <Button variant="ghost" size="icon-sm" onClick={toggle}>
              <IconLayoutSidebarRight className="size-4" />
            </Button>
            <h2 className="text-sm font-semibold tracking-tight">Tasks</h2>
          </div>
          <div className="min-h-0 flex-1 overflow-auto">
            <TaskList />
          </div>
        </div>
      </div>

      {/* Icon Rail — always visible */}
      <div
        role="tablist"
        aria-orientation="vertical"
        className="flex shrink-0 flex-col items-center gap-1 border-l bg-background px-1.5 py-2"
      >
        <Tooltip>
          <TooltipTrigger
            render={
              <button
                role="tab"
                aria-selected={isOpen}
                onClick={toggle}
                className={cn(
                  "flex size-8 items-center justify-center rounded-md border transition-colors",
                  "focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none",
                  isOpen
                    ? "border-border bg-accent text-foreground"
                    : "border-transparent text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                )}
              >
                <IconListCheck />
              </button>
            }
          />
          <TooltipContent side="left">
            <span>Tasks{count > 0 ? ` (${count})` : ""}</span>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}
