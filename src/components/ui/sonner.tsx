'use client';

import { IconExclamationMark, IconLoader } from '@tabler/icons-react';
import { Check, X } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Toaster as Sonner, type ToasterProps } from 'sonner';

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      position='top-center'
      className='toaster group'
      icons={{
        success: (
          <div className='flex items-center justify-center p-1 rounded-full text-background bg-emerald-500 outline-5 outline-emerald-500/10 [&_svg]:size-3.5'>
            <Check strokeWidth={3} />
          </div>
        ),
        info: (
          <div className='flex items-center justify-center p-1 rounded-full text-background bg-blue-500 outline-5 outline-blue-500/10 [&_svg]:size-3.5'>
            <IconExclamationMark stroke={3} />
          </div>
        ),
        warning: (
          <div className='flex items-center justify-center p-1 rounded-full text-background bg-yellow-500 outline-5 outline-yellow-500/10 [&_svg]:size-3.5'>
            <IconExclamationMark stroke={3} />
          </div>
        ),
        error: (
          <div className='flex items-center justify-center p-1 rounded-full text-background bg-red-500 outline-5 outline-red-500/10 [&_svg]:size-3.5'>
            <X strokeWidth={3} />
          </div>
        ),
        loading: <IconLoader className='size-4 animate-spin' />,
      }}
      style={
        {
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)',
          '--border-radius': 'var(--radius)',
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: 'cn-toast !grid !grid-cols-[auto_1fr_auto] !gap-3.5',
          description: '!text-popover-foreground',
          success:
            '!bg-gradient-to-r !from-emerald-500/10 !to-transparent !to-33% !border-emerald-500/20',
          info: '!bg-gradient-to-r !from-blue-500/10 !to-transparent !to-33% !border-blue-500/20',
          warning:
            '!bg-gradient-to-r !from-yellow-500/10 !to-transparent !to-33% !border-yellow-500/20',
          error:
            '!bg-gradient-to-r !from-red-500/10 !to-transparent !to-33% !border-red-500/20',
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
