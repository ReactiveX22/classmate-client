'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function DashboardSkeleton() {
  return (
    <div className='container mx-auto p-6 space-y-8'>
      <div className='space-y-2'>
        <Skeleton className='h-8 w-48' />
        <Skeleton className='h-4 w-32' />
      </div>

      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-4'>
        {[1, 2].map((i) => (
          <Card key={i}>
            <CardHeader className='flex flex-row items-center justify-between pb-2'>
              <Skeleton className='h-4 w-24' />
              <Skeleton className='h-4 w-4' />
            </CardHeader>
            <CardContent>
              <Skeleton className='h-8 w-16 mb-1' />
              <Skeleton className='h-3 w-24' />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className='grid gap-6 lg:grid-cols-3'>
        <div className='lg:col-span-2 space-y-6'>
          <Skeleton className='h-6 w-32' />
          <div className='grid gap-4 sm:grid-cols-2'>
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className='h-32 w-full' />
            ))}
          </div>
        </div>
        <div className='space-y-6'>
          <Skeleton className='h-6 w-40' />
          <Skeleton className='h-[400px] w-full' />
        </div>
      </div>
    </div>
  );
}
