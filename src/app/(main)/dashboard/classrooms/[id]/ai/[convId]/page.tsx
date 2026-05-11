'use client';

import { AiChatPage } from '@/components/ai/ai-chat-page';
import { use } from 'react';

interface ClassroomAiConversationPageProps {
  params: Promise<{ id: string; convId: string }>;
}

export default function ClassroomAiConversationPage({
  params,
}: ClassroomAiConversationPageProps) {
  const { id: classroomId, convId } = use(params);

  return <AiChatPage classroomId={classroomId} initialConvId={convId} />;
}
