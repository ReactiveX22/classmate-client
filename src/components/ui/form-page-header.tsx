'use client';

import * as React from 'react';
import { ArrowLeft, Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { CardDescription, CardTitle } from '@/components/ui/card';

interface FormPageHeaderProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  backLink?: string | number;
  children?: React.ReactNode;
  showDefaultBackButton?: boolean;
  className?: string;
}

export function FormPageHeader({
  title,
  description,
  icon = <Settings className='size-4' />,
  backLink = -1,
  children,
  showDefaultBackButton = true,
  className = '',
}: FormPageHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (typeof backLink === 'number') {
      router.back();
    } else {
      router.push(backLink);
    }
  };

  return (
    <header
      className={cn(
        'sticky top-16 z-30 flex h-16 items-center gap-2 md:gap-4 border-b bg-background/80 backdrop-blur-xl px-4 md:px-6',
        className
      )}
    >
      {showDefaultBackButton && (
        <Button type='button' variant='ghost' size='icon' onClick={handleBack}>
          <ArrowLeft className='h-5 w-5' />
          <span className='sr-only'>Back</span>
        </Button>
      )}

      <div className='flex flex-1 items-center gap-1 md:gap-3'>
        <div className='hidden md:flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-accent-foreground'>
          {icon}
        </div>
        <div className='flex flex-col gap-0.5'>
          <CardTitle>{title}</CardTitle>
          {description && (
            <CardDescription className='hidden lg:block text-xs'>
              {description}
            </CardDescription>
          )}
        </div>
      </div>

      <div className='flex items-center gap-3'>{children}</div>
    </header>
  );
}
