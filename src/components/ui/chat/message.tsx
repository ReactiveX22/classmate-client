'use client';

import * as React from 'react';
import { Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

export type MessageRole = 'user' | 'assistant';

export type MessageProps = {
  children: React.ReactNode;
  role: MessageRole;
  className?: string;
} & React.HTMLAttributes<HTMLElement>;

function Message({ children, className, role, ...props }: MessageProps) {
  return (
    <article
      data-role={role}
      data-slot="message"
      className={cn('group/message flex gap-3 data-[role=user]:justify-end', className)}
      {...props}
    >
      {children}
    </article>
  );
}

export type MessageAvatarProps = {
  role: MessageRole;
  src?: string;
  alt?: string;
  fallback?: string;
  className?: string;
};

function MessageAvatar({
  role,
  src,
  alt,
  fallback,
  className,
}: MessageAvatarProps) {
  const Icon = role === 'assistant' ? Bot : User;

  return (
    <Avatar
      size="sm"
      className={cn(
        'mt-0.5 bg-muted text-muted-foreground group-data-[role=user]/message:order-2',
        className,
      )}
    >
      {src ? <AvatarImage src={src} alt={alt ?? fallback ?? role} /> : null}
      <AvatarFallback>
        {fallback ?? <Icon className="size-3.5" />}
      </AvatarFallback>
    </Avatar>
  );
}

export type MessageContentProps = {
  children: React.ReactNode;
  markdown?: boolean;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>;

function MessageContent({
  children,
  markdown = false,
  className,
  ...props
}: MessageContentProps) {
  const classNames = cn(
    'rounded-lg bg-secondary p-2 text-foreground prose break-words whitespace-normal',
    className,
  );

  if (markdown) {
    return (
      <div data-slot="message-content" className={classNames} {...props}>
        <ReactMarkdown rehypePlugins={[rehypeHighlight]} remarkPlugins={[remarkGfm]}>
          {children as string}
        </ReactMarkdown>
      </div>
    );
  }

  return (
    <div data-slot="message-content" className={classNames} {...props}>
      {children}
    </div>
  );
}

export type MessageActionsProps = React.HTMLAttributes<HTMLDivElement>;

function MessageActions({ children, className, ...props }: MessageActionsProps) {
  return (
    <div
      data-slot="message-actions"
      className={cn(
        'text-muted-foreground flex items-center gap-2 opacity-0 transition-opacity group-hover/message:opacity-100',
        'group-data-[role=user]/message:justify-end',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export type MessageActionProps = {
  className?: string;
  tooltip: React.ReactNode;
  children: React.ReactNode;
  side?: 'top' | 'bottom' | 'left' | 'right';
  delayDuration?: number;
} & React.ComponentProps<typeof Tooltip>;

function MessageAction({
  tooltip,
  children,
  className,
  side = 'top',
  delayDuration,
  ...props
}: MessageActionProps) {
  return (
    <TooltipProvider delay={delayDuration ?? 0}>
      <Tooltip {...props}>
        <TooltipTrigger render={children as React.ReactElement} />
        <TooltipContent side={side} className={className}>
          {tooltip}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export { Message, MessageAvatar, MessageContent, MessageActions, MessageAction };
