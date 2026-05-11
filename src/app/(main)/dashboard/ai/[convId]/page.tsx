'use client';

import { AiChatPage } from '@/components/ai/ai-chat-page';
import { use } from 'react';

interface AiConversationPageProps {
  params: Promise<{ convId: string }>;
}

export default function AiConversationPage({
  params,
}: AiConversationPageProps) {
  const { convId } = use(params);

  return <AiChatPage initialConvId={convId} />;
}
