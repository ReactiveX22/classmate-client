'use client';

import type { AiMessage } from '@/lib/api/services/ai.service';
import {
  Message,
  MessageAvatar,
  MessageContent,
} from '@/components/ui/chat/message';
import { ResponseStream } from '@/components/ui/chat/response-stream';
import { AiStreamingBubble } from '@/components/ai/ai-streaming-bubble';

interface AiMessageListProps {
  messages: AiMessage[];
  streamingContent: string;
  activeTools: string[];
  isStreaming: boolean;
}

export function AiMessageList({
  messages,
  streamingContent,
  activeTools,
  isStreaming,
}: AiMessageListProps) {
  if (messages.length === 0 && !isStreaming) {
    return (
      <div className="flex flex-1 items-center justify-center px-4 text-center">
        <p className="max-w-sm text-sm text-muted-foreground">
          Ask a question about this classroom to start an AI conversation.
        </p>
      </div>
    );
  }

  return (
    <>
      {messages.map((message) => (
        <Message key={message.id} role={message.role}>
          <MessageAvatar role={message.role} />
          <MessageContent>
            <ResponseStream content={message.content} />
          </MessageContent>
        </Message>
      ))}
      <AiStreamingBubble
        activeTools={activeTools}
        content={streamingContent}
        isStreaming={isStreaming}
      />
    </>
  );
}
