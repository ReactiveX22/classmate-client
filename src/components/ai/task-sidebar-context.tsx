"use client";

import { createContext, useCallback, useContext, useState } from "react";

interface TaskSidebarContextValue {
  isOpen: boolean;
  toggle: () => void;
}

const TaskSidebarContext = createContext<TaskSidebarContextValue | null>(null);

export function TaskSidebarProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(true);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  return (
    <TaskSidebarContext.Provider value={{ isOpen, toggle }}>
      {children}
    </TaskSidebarContext.Provider>
  );
}

export function useTaskSidebar() {
  const ctx = useContext(TaskSidebarContext);
  if (!ctx) throw new Error("useTaskSidebar must be used within TaskSidebarProvider");
  return ctx;
}
