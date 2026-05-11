'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

function Loader({
  className,
  variant = 'typing',
  ...props
}: React.ComponentProps<'div'> & {
  variant?: 'typing' | 'wave' | 'text-shimmer';
}) {
  if (variant === 'text-shimmer') {
    return (
      <div
        data-slot="loader"
        className={cn(
          'animate-pulse bg-gradient-to-r from-muted-foreground/40 via-foreground to-muted-foreground/40 bg-[length:200%_100%] bg-clip-text text-sm text-transparent',
          className,
        )}
        {...props}
      >
        Thinking
      </div>
    );
  }

  return (
    <div
      data-slot="loader"
      className={cn('flex items-center gap-1.5', className)}
      {...props}
    >
      {[0, 1, 2].map((index) => (
        <span
          aria-hidden="true"
          className={cn(
            'size-1.5 rounded-full bg-muted-foreground/70',
            variant === 'wave' ? 'animate-bounce' : 'animate-pulse',
          )}
          key={index}
          style={{ animationDelay: `${index * 120}ms` }}
        />
      ))}
      <span className="sr-only">Loading</span>
    </div>
  );
}

export { Loader };
