"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { TaskList } from "@/components/task-sheet/task-list";
import { useTaskSheet } from "@/components/task-sheet/task-sheet-provider";
import { useTodos } from "@/hooks/use-todos";
import { Badge } from "@/components/ui/badge";

export function TaskSheet() {
  const { open, setOpen } = useTaskSheet();
  const { data } = useTodos({ limit: 50 });
  const count = data?.data?.length ?? 0;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent
        side="right"
        className="w-[28rem] sm:max-w-md p-0 gap-0"
        showCloseButton={false}
      >
        <SheetHeader className="flex flex-row items-center justify-between px-4 pt-4 pb-2 border-b">
          <SheetTitle className="text-sm font-semibold">Tasks</SheetTitle>
          <Badge variant="secondary" className="h-4 text-[10px]">
            {count}
          </Badge>
        </SheetHeader>

        <div className="flex flex-col h-[calc(100vh-4rem)]">
          <TaskList />
        </div>
      </SheetContent>
    </Sheet>
  );
}
