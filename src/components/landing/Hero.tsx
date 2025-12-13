import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { IconArrowRight, IconDashboard } from '@tabler/icons-react';
import Link from 'next/link';

export function Hero() {
  return (
    <section className='py-24 md:py-32 px-6 max-w-7xl mx-auto flex flex-col items-center text-center space-y-8'>
      <div className='inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium bg-secondary text-secondary-foreground mb-4'>
        <span className='flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse'></span>
        Coming Soon
      </div>
      <h1 className='text-5xl md:text-7xl font-bold tracking-tight text-foreground max-w-4xl text-pretty'>
        The Operating System for{' '}
        <span className='text-primary'>Modern Education</span>
      </h1>
      <p className='text-xl text-muted-foreground max-w-3xl text-pretty'>
        Unified platform for students, teachers, and admins.
        <br /> Academic life with zero friction.
      </p>
      <div className='flex items-center gap-4 pt-4'>
        <Button size='lg' variant='outline' className='h-12 px-6 text-base'>
          View Demo
        </Button>
        <Link
          href='/signup'
          className={cn(
            buttonVariants({ size: 'lg' }),
            'h-12 px-6 group flex items-center justify-center gap-0 hover:gap-2 transition-all duration-300'
          )}
        >
          Get Started for Free
          <IconArrowRight className='size-5 opacity-0 w-0 group-hover:w-5 group-hover:opacity-100 transition-all duration-300' />
        </Link>
      </div>

      {/* Hero Image Mockup */}
      <div className='mt-16 w-full max-w-5xl rounded-xl border bg-card shadow-2xl overflow-hidden aspect-video relative group'>
        <div className='absolute inset-0 bg-linear-to-tr from-primary/5 to-transparent opacity-50' />
        <div className='absolute inset-0 flex items-center justify-center text-muted-foreground/20'>
          <IconDashboard size={120} stroke={1} />
        </div>
        <div className='absolute bottom-0 left-0 right-0 h-1/2 bg-linear-to-t from-background to-transparent' />
      </div>
    </section>
  );
}
