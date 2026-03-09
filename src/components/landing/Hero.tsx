import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { IconArrowRight, IconDashboard } from '@tabler/icons-react';
import Link from 'next/link';

export function Hero() {
  return (
    <section className='py-16 md:py-24 lg:py-32 px-4 md:px-6 max-w-7xl mx-auto flex flex-col items-center text-center space-y-6 md:space-y-8'>
      <div className='inline-flex items-center rounded-full border px-3 py-1 text-xs md:text-sm font-medium bg-secondary/50 text-secondary-foreground mb-2 md:mb-4'>
        <span className='flex h-1.5 w-1.5 md:h-2 md:w-2 rounded-full bg-primary mr-2 animate-pulse'></span>
        New: Classroom Management
      </div>
      <h1 className='text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground max-w-5xl text-balance leading-tight'>
        The Operating System for{' '}
        <span className='text-transparent bg-clip-text bg-linear-to-r from-primary to-primary/70'>
          Modern Education
        </span>
      </h1>
      <p className='text-lg sm:text-xl text-muted-foreground max-w-2xl text-balance px-2'>
        Unified platform for students, teachers, and admins. Academic life with
        zero friction.
      </p>
      <div className='flex items-center gap-4 pt-4 md:pt-6'>
        <Link
          href='/signup'
          className={cn(
            buttonVariants({ size: 'lg' }),
            'h-12 sm:h-14 px-6 sm:px-8 text-sm sm:text-base group flex items-center justify-center gap-2 transition-all duration-300 rounded-full shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5',
          )}
        >
          Get Started for Free
          <IconArrowRight className='size-4 sm:size-5 transition-transform group-hover:translate-x-1' />
        </Link>
      </div>

      {/* Hero Image Mockup */}
      <div className='mt-12 md:mt-20 w-full max-w-5xl rounded-xl md:rounded-2xl border bg-card/50 backdrop-blur-sm shadow-2xl overflow-hidden aspect-4/3 sm:aspect-video relative group ring-1 ring-border/50'>
        <div className='absolute inset-0 bg-linear-to-tr from-primary/5 via-transparent to-transparent opacity-50' />
        <div className='absolute inset-0 flex items-center justify-center text-muted-foreground/10 group-hover:text-muted-foreground/20 transition-colors duration-500'>
          <IconDashboard
            size={80}
            className='sm:w-[120px] sm:h-[120px]'
            stroke={1}
          />
        </div>
        <div className='absolute bottom-0 left-0 right-0 h-1/2 bg-linear-to-t from-background to-transparent' />
      </div>
    </section>
  );
}
