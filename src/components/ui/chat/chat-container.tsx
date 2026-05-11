'use client';

import * as React from 'react';
import {
  StickToBottom,
  useStickToBottomContext,
  type StickToBottomContext,
} from 'use-stick-to-bottom';
import { ArrowDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type ChatContainerProps = Omit<
  React.ComponentProps<typeof StickToBottom>,
  'children'
> & {
  children: React.ReactNode | ((context: StickToBottomContext) => React.ReactNode);
};

function ChatContainer({ className, children, ...props }: ChatContainerProps) {
  return (
    <StickToBottom
      className={cn('relative flex min-h-0 flex-1 flex-col overflow-y-auto', className)}
      resize="smooth"
      initial="smooth"
      {...props}
    >
      {children}
    </StickToBottom>
  );
}

function ChatContainerContent({
  className,
  scrollClassName,
  ...props
}: React.ComponentProps<typeof StickToBottom.Content>) {
  return (
    <StickToBottom.Content
      className={cn('flex min-h-full flex-col gap-4 px-4 py-6', className)}
      scrollClassName={cn('scroll-pb-6', scrollClassName)}
      {...props}
    />
  );
}

function ChatScrollButton({
  className,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { isAtBottom, scrollToBottom } = useStickToBottomContext();

  if (isAtBottom) {
    return null;
  }

  return (
    <Button
      aria-label="Scroll to latest message"
      className={cn(
        'absolute right-4 bottom-4 z-10 rounded-full shadow-md',
        className,
      )}
      onClick={() => scrollToBottom({ animation: 'smooth' })}
      size="icon-sm"
      type="button"
      variant="secondary"
      {...props}
    >
      <ArrowDown />
    </Button>
  );
}

export { ChatContainer, ChatContainerContent, ChatScrollButton };
