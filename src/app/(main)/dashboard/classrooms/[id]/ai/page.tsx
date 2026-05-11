'use client';

import { AiChatPage } from '@/components/ai/ai-chat-page';
import { use } from 'react';

interface ClassroomAiPageProps {
  params: Promise<{ id: string }>;
}

export default function ClassroomAiPage({ params }: ClassroomAiPageProps) {
  const { id: classroomId } = use(params);

  return <AiChatPage classroomId={classroomId} />;
}
