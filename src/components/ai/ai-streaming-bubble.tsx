'use client';

import {
  Message,
  MessageAvatar,
  MessageContent,
} from '@/components/ui/chat/message';
import { Loader } from '@/components/ui/chat/loader';
import { ResponseStream } from '@/components/ui/chat/response-stream';
import { AiToolIndicator } from '@/components/ai/ai-tool-indicator';

interface AiStreamingBubbleProps {
  content: string;
  activeTools: string[];
  isStreaming: boolean;
}

export function AiStreamingBubble({
  content,
  activeTools,
  isStreaming,
}: AiStreamingBubbleProps) {
  if (!isStreaming && !content && activeTools.length === 0) {
    return null;
  }

  return (
    <Message role="assistant">
      <MessageAvatar role="assistant" />
      <MessageContent>
        {content ? <ResponseStream content={content} /> : <Loader />}
        <AiToolIndicator className="mt-3" tools={activeTools} />
      </MessageContent>
    </Message>
  );
}
