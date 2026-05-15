'use client';

import { AiAutoMessageProvider } from '@/contexts/ai-auto-message-context';

export default function AiLayout({ children }: { children: React.ReactNode }) {
  return <AiAutoMessageProvider>{children}</AiAutoMessageProvider>;
}
