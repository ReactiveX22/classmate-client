import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function PostSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className='space-y-3'>
          <div className='flex items-center gap-2'>
            <Skeleton className='h-5 w-24' />
            <Skeleton className='h-5 w-16' />
          </div>
          <Skeleton className='h-6 w-3/4' />
          <Skeleton className='h-3 w-32' />
        </div>
      </CardHeader>
      <CardContent className='space-y-3'>
        <Skeleton className='h-4 w-full' />
        <Skeleton className='h-4 w-full' />
        <Skeleton className='h-4 w-2/3' />
      </CardContent>
    </Card>
  );
}
