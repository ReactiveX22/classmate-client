import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export function CTA() {
  return (
    <section className='py-24 px-6 border-t'>
      <div className='max-w-3xl mx-auto text-center space-y-8'>
        <div className='inline-block rounded-lg bg-muted px-3 py-1 text-sm'>
          In Development
        </div>
        <h2 className='text-3xl md:text-5xl font-bold'>
          Ready to modernize your campus?
        </h2>
        <p className='text-xl text-muted-foreground'>
          We are currently in active development. Sign up for early access
          updates.
        </p>
        <div className='flex justify-center gap-4'>
          <Link
            href='/signup'
            className={cn(
              buttonVariants({ size: 'lg' }),
              'h-12 px-8 text-base'
            )}
          >
            Get Early Access
          </Link>
        </div>
      </div>
    </section>
  );
}
