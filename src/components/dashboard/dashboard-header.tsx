'use client';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';

type DashboardHeaderProps = React.HTMLAttributes<HTMLElement> & {
  fixed?: boolean;
  ref?: React.Ref<HTMLElement>;
  title?: string;
};

export function DashboardHeader({
  className,
  fixed = true,
  children,
  title = 'Dashboard',
  ...props
}: DashboardHeaderProps) {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      setOffset(document.body.scrollTop || document.documentElement.scrollTop);
    };

    // Add scroll listener to the body
    document.addEventListener('scroll', onScroll, { passive: true });

    // Clean up the event listener on unmount
    return () => document.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'flex h-16 items-center gap-2 border-b bg-background px-4',
        fixed && 'sticky top-0 z-50',
        offset > 10 && fixed ? 'shadow' : 'shadow-none',
        className
      )}
      {...props}
    >
      <div className='flex items-center gap-2'>
        <SidebarTrigger className='-ml-1' />
        <Separator orientation='vertical' className='mr-2 h-6 my-auto' />
        <span className='font-normal text-sm'>{title}</span>
      </div>
      <div className='flex items-center gap-2 ml-auto'>{children}</div>
    </header>
  );
}
