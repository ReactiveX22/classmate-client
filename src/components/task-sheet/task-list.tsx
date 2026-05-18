"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Markdown } from "@/components/ui/chat/markdown";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  useCreateTodo,
  useDeleteTodo,
  useTodos,
  useUpdateTodo,
} from "@/hooks/use-todos";
import {
  Todo,
  TodoPriority,
  TodoStatus,
} from "@/lib/api/services/todo.service";
import { cn } from "@/lib/utils";
import {
  IconChevronDown,
  IconChevronRight,
  IconChevronsDown,
  IconChevronsUp,
  IconCircle,
  IconCircleCheck,
  IconCircleHalf2,
  IconDeviceFloppy,
  IconPencil,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";

const priorityColors: Record<TodoPriority, string> = {
  low: "bg-blue-100 text-blue-700 hover:bg-blue-200 hover:text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 dark:hover:text-blue-300",
  medium:
    "bg-yellow-100 text-yellow-700 hover:bg-yellow-200 hover:text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 dark:hover:bg-yellow-900/50 dark:hover:text-yellow-300",
  high: "bg-red-100 text-red-700 hover:bg-red-200 hover:text-red-800 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50 dark:hover:text-red-300",
};

const priorityDotColors: Record<TodoPriority, string> = {
  low: "bg-blue-500",
  medium: "bg-yellow-500",
  high: "bg-red-500",
};

function StatusDot({ status }: { status: TodoStatus }) {
  if (status === "completed") {
    return <IconCircleCheck className="size-3.5 text-green-500" />;
  }
  if (status === "in_progress") {
    return <IconCircleHalf2 className="size-3.5 text-blue-500" />;
  }
  return <IconCircle className="size-3.5 text-muted-foreground" />;
}

function stripMarkdown(md: string): string {
  return md
    .replace(/#{1,6}\s?/g, "")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/`{1,3}(.+?)`{1,3}/g, "$1")
    .replace(/\[(.+?)\]\(.+?\)/g, "$1")
    .replace(/!\[.*?\]\(.+?\)/g, "")
    .replace(/^-+\s?/gm, "")
    .replace(/\n+/g, " ")
    .trim();
}

function StatusSelect({ todo }: { todo: Todo }) {
  const updateTodo = useUpdateTodo();

  return (
    <Select
      value={todo.status}
      onValueChange={(v) =>
        updateTodo.mutate({ id: todo.id, data: { status: v as TodoStatus } })
      }
    >
      <SelectTrigger
        className="border-0 bg-transparent dark:bg-transparent p-0 shadow-none hover:bg-transparent dark:hover:bg-transparent rounded-sm [&>svg:last-child]:hidden cursor-pointer"
        size="sm"
      >
        <StatusDot status={todo.status} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="pending">
          <span className="flex items-center gap-1.5">
            <IconCircle className="size-3 text-muted-foreground" />
            Pending
          </span>
        </SelectItem>
        <SelectItem value="in_progress">
          <span className="flex items-center gap-1.5">
            <IconCircleHalf2 className="size-3 text-blue-500" />
            In Progress
          </span>
        </SelectItem>
        <SelectItem value="completed">
          <span className="flex items-center gap-1.5">
            <IconCircleCheck className="size-3 text-green-500" />
            Completed
          </span>
        </SelectItem>
      </SelectContent>
    </Select>
  );
}

function EditTaskPopover({
  todo,
  children,
}: {
  todo: Todo;
  children: React.ReactNode;
}) {
  const updateTodo = useUpdateTodo();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const [description, setDescription] = useState(todo.description ?? "");
  const [priority, setPriority] = useState<TodoPriority>(todo.priority);
  const [status, setStatus] = useState<TodoStatus>(todo.status);

  useEffect(() => {
    if (open) {
      setTitle(todo.title);
      setDescription(todo.description ?? "");
      setPriority(todo.priority);
      setStatus(todo.status);
    }
  }, [open, todo]);

  const handleSave = () => {
    if (!title.trim()) return;
    updateTodo.mutate({
      id: todo.id,
      data: {
        title: title.trim(),
        description: description || undefined,
        priority,
        status,
      },
    });
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger nativeButton={false} render={<span>{children}</span>} />
      <PopoverContent className="w-80">
        <div className="flex flex-col gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Title
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-8 text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Description
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional markdown description..."
              className="min-h-[80px] max-h-[200px] resize-y text-sm"
            />
          </div>

          <div className="flex gap-3">
            <div className="flex-1 space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                Priority
              </label>
              <Select
                value={priority}
                onValueChange={(v) => setPriority(v as TodoPriority)}
              >
                <SelectTrigger
                  className="h-8 w-full text-xs capitalize"
                  size="sm"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">
                    <span className="flex items-center gap-1.5">
                      <span className="size-2 rounded-full bg-red-500" />
                      High
                    </span>
                  </SelectItem>
                  <SelectItem value="medium">
                    <span className="flex items-center gap-1.5">
                      <span className="size-2 rounded-full bg-yellow-500" />
                      Medium
                    </span>
                  </SelectItem>
                  <SelectItem value="low">
                    <span className="flex items-center gap-1.5">
                      <span className="size-2 rounded-full bg-blue-500" />
                      Low
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                Status
              </label>
              <Select
                value={status}
                onValueChange={(v) => setStatus(v as TodoStatus)}
              >
                <SelectTrigger
                  className="h-8 w-full text-xs capitalize"
                  size="sm"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-1.5">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              className="h-7 px-2 text-xs"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={updateTodo.isPending || !title.trim()}
              className="h-7 px-2 text-xs"
            >
              <IconDeviceFloppy className="mr-1 size-3" />
              Save
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function TaskItem({ todo }: { todo: Todo }) {
  const updateTodo = useUpdateTodo();
  const deleteTodo = useDeleteTodo();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState(todo.title);
  const [descExpanded, setDescExpanded] = useState(false);
  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditingTitle) {
      titleInputRef.current?.focus();
      titleInputRef.current?.select();
    }
  }, [isEditingTitle]);

  useEffect(() => {
    setTitleValue(todo.title);
  }, [todo.title]);

  const isCompleted = todo.status === "completed";

  const saveTitle = () => {
    if (!titleValue.trim()) {
      setTitleValue(todo.title);
      setIsEditingTitle(false);
      return;
    }
    if (titleValue.trim() !== todo.title) {
      updateTodo.mutate({
        id: todo.id,
        data: { title: titleValue.trim() },
      });
    }
    setIsEditingTitle(false);
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      saveTitle();
    } else if (e.key === "Escape") {
      setTitleValue(todo.title);
      setIsEditingTitle(false);
    }
  };

  const descriptionPreview = todo.description
    ? stripMarkdown(todo.description)
    : null;

  return (
    <div className="group flex flex-col gap-1 rounded-md p-2 hover:bg-muted/50">
      <div className="flex items-center gap-2">
        <StatusSelect todo={todo} />
        {isEditingTitle ? (
          <Input
            ref={titleInputRef}
            value={titleValue}
            onChange={(e) => setTitleValue(e.target.value)}
            onBlur={saveTitle}
            onKeyDown={handleTitleKeyDown}
            className="h-6 min-w-0 flex-1 border-none px-1 py-0 text-sm shadow-none ring-0 focus-visible:ring-0"
          />
        ) : (
          <span
            onClick={() => setIsEditingTitle(true)}
            className={cn(
              "min-w-0 flex-1 cursor-text truncate text-sm font-medium",
              isCompleted && "text-muted-foreground line-through",
            )}
          >
            {todo.title}
          </span>
        )}
        <div className="flex shrink-0 gap-0.5">
          <EditTaskPopover todo={todo}>
            <Button
              variant="ghost"
              size="icon-xs"
              className="invisible group-hover:visible shrink-0"
            >
              <IconPencil className="size-3 text-muted-foreground" />
            </Button>
          </EditTaskPopover>
          <Button
            variant="ghost"
            size="icon-xs"
            className="invisible group-hover:visible shrink-0"
            onClick={() => deleteTodo.mutate(todo.id)}
          >
            <IconTrash className="size-3 text-destructive" />
          </Button>
        </div>
      </div>
      {descriptionPreview && (
        <div className="ml-5 relative">
          {descExpanded ? (
            <div className="chat-markdown text-xs min-w-0">
              <Markdown>{todo.description!}</Markdown>
            </div>
          ) : (
            <span className="line-clamp-2 text-xs text-muted-foreground">
              {descriptionPreview}
            </span>
          )}
          <button
            onClick={() => setDescExpanded(!descExpanded)}
            className="absolute top-0 right-0 shrink-0 text-muted-foreground hover:text-foreground cursor-pointer"
          >
            {descExpanded ? (
              <IconChevronsUp className="size-3" />
            ) : (
              <IconChevronsDown className="size-3" />
            )}
          </button>
        </div>
      )}
      <div className="ml-5 flex items-center gap-1">
        <Badge
          variant="ghost"
          className={cn(
            "h-4 cursor-default px-1 text-[10px] capitalize",
            priorityColors[todo.priority],
          )}
        >
          <span
            className={cn(
              "mr-1 inline-block size-1.5 rounded-full",
              priorityDotColors[todo.priority],
            )}
          />
          {todo.priority}
        </Badge>
      </div>
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
      <Button
        type="submit"
        variant="default"
        size="icon-xs"
        disabled={!title.trim()}
      >
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
        <span className="ml-2 text-[10px]">{tasks.length}</span>
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

export function TaskList() {
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
    <>
      <div className="border-b p-2">
        <AddTaskForm onAdd={handleAdd} />
      </div>

      <ScrollArea className="flex-1">
        {isLoading ? (
          <div className="flex h-20 items-center justify-center text-xs text-muted-foreground">
            Loading tasks...
          </div>
        ) : todos.length === 0 ? (
          <div className="flex h-20 items-center justify-center text-xs text-muted-foreground">
            No tasks yet
          </div>
        ) : (
          <div className="space-y-1 p-1">
            <TaskGroup title="In Progress" tasks={inProgress} />
            <TaskGroup title="Pending" tasks={pending} />
            <TaskGroup
              title="Completed"
              tasks={completed}
              defaultOpen={false}
            />
          </div>
        )}
      </ScrollArea>
    </>
  );
}
