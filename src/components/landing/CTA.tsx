import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export function CTA() {
  return (
    <section className='py-16 md:py-24 px-4 sm:px-6 border-t mt-12 md:mt-24 relative overflow-hidden'>
      {/* Background decoration */}
      <div className='absolute inset-0 bg-primary/5 pointer-events-none' />
      <div className='absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] opacity-20 bg-primary/20 blur-[100px] rounded-full pointer-events-none' />

      <div className='max-w-3xl mx-auto text-center space-y-6 md:space-y-8 relative z-10'>
        <h2 className='text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-balance leading-tight'>
          Ready to modernize your campus?
        </h2>
        <p className='text-lg sm:text-xl text-muted-foreground text-balance'>
          Join our platform today and streamline your campus operations with a
          unified, modern interface.
        </p>
        <div className='flex justify-center gap-4 pt-4 md:pt-6'>
          <Link
            href='/signup'
            className={cn(
              buttonVariants({ size: 'lg' }),
              'h-12 sm:h-14 px-8 text-sm sm:text-base rounded-full shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5 transition-all w-full sm:w-auto',
            )}
          >
            Get Started Now
          </Link>
        </div>
      </div>
    </section>
  );
}
