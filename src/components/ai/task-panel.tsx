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
