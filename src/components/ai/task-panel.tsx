"use client";

import { Badge } from "@/components/ui/badge";
import { TaskList } from "@/components/task-sheet/task-list";
import { useTodos } from "@/hooks/use-todos";

export function TaskPanel() {
  const { data } = useTodos({ limit: 50 });
  const count = data?.data?.length ?? 0;

  return (
    <div className="flex h-full flex-col border-l bg-background">
      <div className="flex items-center justify-between border-b px-3 py-2">
        <h2 className="text-sm font-semibold">Tasks</h2>
        <Badge variant="secondary" className="h-4 text-[10px]">
          {count}
        </Badge>
      </div>

      <TaskList />
    </div>
  );
}

export function TaskPanelRail({ onClick }: { onClick: () => void }) {
  const { data } = useTodos({ limit: 50 });
  const count = data?.data?.length ?? 0;

  return (
    <button
      onClick={onClick}
      className="flex h-full w-12 flex-col items-center border-l bg-background pt-3 transition-colors hover:bg-accent/50"
    >
      <span
        className="select-none text-xs font-semibold text-muted-foreground"
        style={{ writingMode: "vertical-rl" }}
      >
        Tasks
      </span>
      {count > 0 && (
        <Badge variant="secondary" className="mt-2 h-4 text-[10px]">
          {count}
        </Badge>
      )}
    </button>
  );
}
