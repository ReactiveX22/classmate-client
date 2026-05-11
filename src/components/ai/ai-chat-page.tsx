'use client';

interface AiChatPageProps {
  classroomId: string;
  initialConvId?: string;
}

export function AiChatPage({ classroomId, initialConvId }: AiChatPageProps) {
  return (
    <div className='flex h-full min-h-[calc(100vh-8rem)] flex-col gap-4 p-4'>
      <div>
        <h1 className='text-2xl font-semibold tracking-tight'>AI Chat</h1>
        <p className='text-sm text-muted-foreground'>
          Classroom: {classroomId}
        </p>
        {initialConvId ? (
          <p className='text-sm text-muted-foreground'>Conversation: {initialConvId}</p>
        ) : (
          <p className='text-sm text-muted-foreground'>Starting a new conversation</p>
        )}
      </div>
    </div>
  );
}
