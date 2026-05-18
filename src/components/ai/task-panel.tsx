"use client";

import { useState } from "react";
import { useTodos, useCreateTodo, useUpdateTodo, useDeleteTodo } from "@/hooks/use-todos";
import { Todo, TodoPriority, TodoStatus } from "@/lib/api/services/todo.service";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IconPlus, IconTrash, IconChevronDown, IconChevronRight } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

const priorityColors: Record<TodoPriority, string> = {
  low: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  medium: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  high: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

function TaskItem({ todo }: { todo: Todo }) {
  const updateTodo = useUpdateTodo();
  const deleteTodo = useDeleteTodo();
  const isCompleted = todo.status === "completed";

  const toggleStatus = () => {
    const newStatus: TodoStatus = isCompleted ? "pending" : "completed";
    updateTodo.mutate({ id: todo.id, data: { status: newStatus } });
  };

  return (
    <div className="group flex items-start gap-2 rounded-md p-2 hover:bg-muted/50">
      <Checkbox
        checked={isCompleted}
        onCheckedChange={toggleStatus}
        className="mt-0.5 shrink-0"
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span
            className={cn(
              "truncate text-sm",
              isCompleted && "text-muted-foreground line-through",
            )}
          >
            {todo.title}
          </span>
        </div>
        <div className="mt-1 flex items-center gap-1">
          <Badge
            variant="ghost"
            className={cn("h-4 px-1 text-[10px]", priorityColors[todo.priority])}
          >
            {todo.priority}
          </Badge>
          {todo.status === "in_progress" && (
            <Badge variant="secondary" className="h-4 px-1 text-[10px]">
              in progress
            </Badge>
          )}
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon-xs"
        className="invisible shrink-0 group-hover:visible"
        onClick={() => deleteTodo.mutate(todo.id)}
      >
        <IconTrash className="size-3" />
      </Button>
    </div>
  );
}

function AddTaskForm({ onAdd }: { onAdd: (title: string) => void }) {
  const [title, setTitle] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd(title.trim());
    setTitle("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-1">
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Add a task..."
        className="h-7 border-none shadow-none ring-0 focus-visible:ring-0 text-xs"
      />
      <Button type="submit" variant="default" size="icon-xs" disabled={!title.trim()}>
        <IconPlus className="size-3" />
      </Button>
    </form>
  );
}

function TaskGroup({
  title,
  tasks,
  defaultOpen = true,
}: {
  title: string;
  tasks: Todo[];
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  if (tasks.length === 0) return null;

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-1 px-1 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
      >
        {open ? (
          <IconChevronDown className="size-3" />
        ) : (
          <IconChevronRight className="size-3" />
        )}
        {title}
        <span className="ml-auto text-[10px]">{tasks.length}</span>
      </button>
      {open && (
        <div className="ml-1">
          {tasks.map((task) => (
            <TaskItem key={task.id} todo={task} />
          ))}
        </div>
      )}
    </div>
  );
}

export function TaskPanel() {
  const { data, isLoading } = useTodos({ limit: 50 });
  const createTodo = useCreateTodo();

  const todos = data?.data ?? [];
  const pending = todos.filter((t) => t.status === "pending");
  const inProgress = todos.filter((t) => t.status === "in_progress");
  const completed = todos.filter((t) => t.status === "completed");

  const handleAdd = (title: string) => {
    createTodo.mutate({ title, priority: "medium" });
  };

  return (
    <div className="flex h-full flex-col border-l bg-background">
      <div className="flex items-center justify-between border-b px-3 py-2">
        <h2 className="text-sm font-semibold">Tasks</h2>
        <Badge variant="secondary" className="h-4 text-[10px]">
          {todos.length}
        </Badge>
      </div>

      <div className="border-b p-2">
        <AddTaskForm onAdd={handleAdd} />
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-2">
        {isLoading ? (
          <div className="flex h-20 items-center justify-center text-xs text-muted-foreground">
            Loading tasks...
          </div>
        ) : todos.length === 0 ? (
          <div className="flex h-20 items-center justify-center text-xs text-muted-foreground">
            No tasks yet
          </div>
        ) : (
          <div className="space-y-1">
            <TaskGroup title="In Progress" tasks={inProgress} />
            <TaskGroup title="Pending" tasks={pending} />
            <TaskGroup title="Completed" tasks={completed} defaultOpen={false} />
          </div>
        )}
      </div>
    </div>
  );
}
