'use client';

import * as React from 'react';
import { Bot, User } from 'lucide-react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

type MessageRole = 'user' | 'assistant';

interface MessageProps extends React.ComponentProps<'article'> {
  role: MessageRole;
}

function Message({ className, role, ...props }: MessageProps) {
  return (
    <article
      data-role={role}
      data-slot="message"
      className={cn(
        'group/message flex w-full gap-3 data-[role=user]:justify-end',
        className,
      )}
      {...props}
    />
  );
}

interface MessageAvatarProps extends React.ComponentProps<typeof Avatar> {
  role: MessageRole;
}

function MessageAvatar({ className, role, ...props }: MessageAvatarProps) {
  const Icon = role === 'assistant' ? Bot : User;

  return (
    <Avatar
      data-slot="message-avatar"
      size="sm"
      className={cn(
        'mt-0.5 bg-muted text-muted-foreground group-data-[role=user]/message:order-2',
        className,
      )}
      {...props}
    >
      <AvatarFallback>
        <Icon className="size-3.5" />
      </AvatarFallback>
    </Avatar>
  );
}

function MessageContent({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="message-content"
      className={cn(
        'max-w-[min(42rem,calc(100%-3rem))] rounded-lg border bg-card px-3 py-2 text-sm leading-6 shadow-xs',
        'group-data-[role=user]/message:bg-primary group-data-[role=user]/message:text-primary-foreground',
        'group-data-[role=assistant]/message:border-transparent group-data-[role=assistant]/message:bg-muted/50',
        className,
      )}
      {...props}
    />
  );
}

function MessageActions({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="message-actions"
      className={cn(
        'mt-1 flex items-center gap-1 opacity-0 transition-opacity group-hover/message:opacity-100',
        'group-data-[role=user]/message:justify-end',
        className,
      )}
      {...props}
    />
  );
}

export {
  Message,
  MessageAvatar,
  MessageContent,
  MessageActions,
  type MessageRole,
};
