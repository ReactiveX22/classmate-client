'use client';

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

interface AiAutoMessageContextValue {
  pendingMessage: string | null;
  setPendingMessage: (message: string | null) => void;
}

const AiAutoMessageContext = createContext<AiAutoMessageContextValue | null>(null);

export function AiAutoMessageProvider({ children }: { children: ReactNode }) {
  const [pendingMessage, setPendingMessage] = useState<string | null>(null);

  return (
    <AiAutoMessageContext.Provider value={{ pendingMessage, setPendingMessage }}>
      {children}
    </AiAutoMessageContext.Provider>
  );
}

export function useAiAutoMessage() {
  const context = useContext(AiAutoMessageContext);
  if (!context) {
    throw new Error('useAiAutoMessage must be used within AiAutoMessageProvider');
  }
  return context;
}
