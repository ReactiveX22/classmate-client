"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

interface AiAutoMessageContextValue {
  pendingMessage: string | null;
  pendingWebSearch: boolean;
  setPendingMessage: (message: string | null, webSearch?: boolean) => void;
}

const AiAutoMessageContext = createContext<AiAutoMessageContextValue | null>(
  null,
);

export function AiAutoMessageProvider({ children }: { children: ReactNode }) {
  const [pending, setPending] = useState<{
    message: string | null;
    webSearch: boolean;
  }>({ message: null, webSearch: false });

  const setPendingMessage = (message: string | null, webSearch = false) => {
    setPending({ message, webSearch });
  };

  return (
    <AiAutoMessageContext.Provider
      value={{
        pendingMessage: pending.message,
        pendingWebSearch: pending.webSearch,
        setPendingMessage,
      }}
    >
      {children}
    </AiAutoMessageContext.Provider>
  );
}

export function useAiAutoMessage() {
  const context = useContext(AiAutoMessageContext);
  if (!context) {
    throw new Error(
      "useAiAutoMessage must be used within AiAutoMessageProvider",
    );
  }
  return context;
}
