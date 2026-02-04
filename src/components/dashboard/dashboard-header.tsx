'use client';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

type DashboardHeaderProps = React.HTMLAttributes<HTMLElement> & {
  fixed?: boolean;
  ref?: React.Ref<HTMLElement>;
};

export function DashboardHeader({
  className,
  fixed = true,
  children,
  ...props
}: DashboardHeaderProps) {
  return (
    <header
      className={cn(
        'flex h-14 items-center gap-2 border-b bg-background px-4',
        fixed && 'sticky top-0 z-50',
        className,
      )}
      {...props}
    >
      <div className='flex items-center gap-2'>
        <SidebarTrigger className='-ml-1' />
      </div>
      <div className='flex items-center gap-2 ml-auto'>{children}</div>
    </header>
  );
}
