"use client";

import * as React from "react";

const TASK_SHEET_KEYBOARD_SHORTCUT = "k";

type TaskSheetContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  toggle: () => void;
};

const TaskSheetContext = React.createContext<TaskSheetContextValue | null>(
  null,
);

export function useTaskSheet() {
  const context = React.useContext(TaskSheetContext);
  if (!context) {
    throw new Error("useTaskSheet must be used within a TaskSheetProvider.");
  }
  return context;
}

export function TaskSheetProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);

  const toggle = React.useCallback(() => {
    setOpen((prev) => !prev);
  }, []);

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === TASK_SHEET_KEYBOARD_SHORTCUT &&
        (event.metaKey || event.ctrlKey)
      ) {
        event.preventDefault();
        toggle();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggle]);

  return (
    <TaskSheetContext.Provider value={{ open, setOpen, toggle }}>
      {children}
    </TaskSheetContext.Provider>
  );
}
