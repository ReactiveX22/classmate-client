import * as React from 'react';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  children,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between',
        className,
      )}
    >
      <div className='flex flex-col gap-1'>
        <h1 className='text-xl sm:text-2xl font-bold tracking-tight'>
          {title}
        </h1>
        {description && (
          <p className='text-sm sm:text-base text-muted-foreground'>
            {description}
          </p>
        )}
      </div>
      {children && <div className='flex items-center gap-3'>{children}</div>}
    </div>
  );
}
