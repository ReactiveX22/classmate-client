'use client';

import { AiChatPage } from '@/components/ai/ai-chat-page';
import { useAiAutoMessage } from '@/contexts/ai-auto-message-context';
import { use } from 'react';
import { useEffect } from 'react';

interface AiConversationPageProps {
  params: Promise<{ convId: string }>;
}

export default function AiConversationPage({
  params,
}: AiConversationPageProps) {
  const { convId } = use(params);
  const { pendingMessage, setPendingMessage } = useAiAutoMessage();

  useEffect(() => {
    if (pendingMessage) {
      setPendingMessage(null);
    }
  }, [convId]);

  return <AiChatPage convId={convId} autoMessage={pendingMessage} />;
}
