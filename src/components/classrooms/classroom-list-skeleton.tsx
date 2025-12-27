import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function ClassroomListSkeleton() {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Card key={i} className='overflow-hidden border-border/50 bg-card/50'>
          <CardHeader className='pb-2'>
            <div className='space-y-3'>
              <div className='flex gap-2'>
                <Skeleton className='h-4 w-12' />
                <Skeleton className='h-4 w-16' />
              </div>
              <Skeleton className='h-6 w-3/4' />
              <Skeleton className='h-4 w-1/2' />
            </div>
          </CardHeader>
          <CardContent className='pt-2 space-y-4 flex-1'>
            <div className='space-y-2'>
              <Skeleton className='h-3 w-full' />
              <Skeleton className='h-3 w-2/3' />
            </div>
            <div className='flex gap-4'>
              <Skeleton className='h-4 w-16' />
              <Skeleton className='h-4 w-16' />
            </div>
          </CardContent>
          <CardFooter className='pt-4 pb-5 flex flex-col gap-4'>
            <div className='flex justify-between items-center w-full'>
              <Skeleton className='h-3 w-20' />
              <Skeleton className='h-8 w-24 rounded-md' />
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
