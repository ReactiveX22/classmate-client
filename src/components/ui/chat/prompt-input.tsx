'use client';

import * as React from 'react';

import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

function PromptInput({ className, ...props }: React.ComponentProps<'form'>) {
  return (
    <form
      data-slot="prompt-input"
      className={cn(
        'border-input bg-background focus-within:border-ring focus-within:ring-ring/50 rounded-lg border shadow-xs transition-[border-color,box-shadow] focus-within:ring-[3px]',
        className,
      )}
      {...props}
    />
  );
}

function PromptInputTextarea({
  className,
  onKeyDown,
  ...props
}: React.ComponentProps<typeof Textarea>) {
  return (
    <Textarea
      data-slot="prompt-input-textarea"
      className={cn(
        'max-h-40 min-h-12 resize-none border-0 px-3 py-3 shadow-none focus-visible:ring-0',
        className,
      )}
      onKeyDown={onKeyDown}
      rows={1}
      {...props}
    />
  );
}

function PromptInputActions({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="prompt-input-actions"
      className={cn(
        'flex min-h-11 items-center justify-between gap-2 border-t px-2 py-2',
        className,
      )}
      {...props}
    />
  );
}

export { PromptInput, PromptInputTextarea, PromptInputActions };
