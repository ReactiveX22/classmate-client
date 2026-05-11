'use client';

import { FormEvent, KeyboardEvent, useState } from 'react';
import { Send, Square } from 'lucide-react';

import {
  PromptInput,
  PromptInputActions,
  PromptInputTextarea,
} from '@/components/ui/chat/prompt-input';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface AiInputBarProps {
  isStreaming: boolean;
  onSend: (message: string) => void | Promise<void>;
  onStop: () => void;
}

export function AiInputBar({ isStreaming, onSend, onStop }: AiInputBarProps) {
  const [message, setMessage] = useState('');
  const canSend = message.trim().length > 0 && !isStreaming;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canSend) {
      return;
    }

    const nextMessage = message.trim();
    setMessage('');
    await onSend(nextMessage);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  };

  return (
    <PromptInput onSubmit={handleSubmit}>
      <PromptInputTextarea
        disabled={isStreaming}
        onChange={(event) => setMessage(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask about this classroom..."
        value={message}
      />
      <PromptInputActions>
        <span className="text-xs text-muted-foreground">
          Enter to send, Shift+Enter for a new line
        </span>
        {isStreaming ? (
          <Tooltip>
            <TooltipTrigger render={<Button size="icon-sm" type="button" />} onClick={onStop}>
              <Square />
            </TooltipTrigger>
            <TooltipContent>Stop response</TooltipContent>
          </Tooltip>
        ) : (
          <Tooltip>
            <TooltipTrigger
              render={
                <Button disabled={!canSend} size="icon-sm" type="submit" />
              }
            >
              <Send />
            </TooltipTrigger>
            <TooltipContent>Send message</TooltipContent>
          </Tooltip>
        )}
      </PromptInputActions>
    </PromptInput>
  );
}
