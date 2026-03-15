'use client';

import { Providers } from '@/lib/providers/QueryProvider';
import { NuqsAdapter } from 'nuqs/adapters/next/app';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NuqsAdapter>
      <Providers>
        <div className='min-h-screen flex items-center justify-center bg-muted/30 p-4'>
          <div className='w-full max-w-md'>{children}</div>
        </div>
      </Providers>
    </NuqsAdapter>
  );
}
