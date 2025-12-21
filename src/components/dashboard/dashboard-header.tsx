'use client';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

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
  return (
    <header
      className={cn(
        'flex h-16 items-center gap-2 border-b bg-background px-4',
        fixed && 'sticky top-0 z-50',
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
