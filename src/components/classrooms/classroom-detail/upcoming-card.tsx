import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useUpcomingPosts } from '@/hooks/use-classrooms';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { parseAsString, useQueryState } from 'nuqs';

interface UpcomingCardProps {
  classroomId: string;
  isTeacher?: boolean;
}

export function UpcomingCard({ classroomId }: UpcomingCardProps) {
  const router = useRouter();
  const [, setTab] = useQueryState('tab', parseAsString.withDefault('stream'));
  const {
    data: upcomingPosts,
    isLoading,
    isError,
  } = useUpcomingPosts(classroomId);

  if (isLoading) {
    return (
      <Card className='hidden md:block w-64 h-fit shrink-0'>
        <CardHeader className='pb-3'>
          <CardTitle className='text-sm font-semibold'>Upcoming</CardTitle>
        </CardHeader>
        <CardContent className='space-y-3'>
          <div className='space-y-2'>
            <Skeleton className='h-3 w-3/4' />
            <Skeleton className='h-2 w-1/2' />
          </div>
          <div className='space-y-2'>
            <Skeleton className='h-3 w-3/4' />
            <Skeleton className='h-2 w-1/2' />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError) return null;

  const hasUpcoming = upcomingPosts && upcomingPosts.length > 0;

  return (
    <Card className='hidden md:block w-64 h-fit shrink-0'>
      <CardHeader className='pb-3'>
        <CardTitle className='text-sm font-semibold'>Upcoming</CardTitle>
      </CardHeader>
      <CardContent className='text-xs'>
        {!hasUpcoming ? (
          <p className='text-muted-foreground'>No work due soon</p>
        ) : (
          <div className='space-y-3'>
            <ul className='space-y-3'>
              {upcomingPosts.map((post) => (
                <li key={post.id} className='flex flex-col gap-0.5'>
                  <span
                    onClick={() =>
                      router.push(
                        `/dashboard/classrooms/${classroomId}/assignments/${post.id}`,
                      )
                    }
                    className='font-medium line-clamp-1 hover:underline cursor-pointer'
                  >
                    {post.title}
                  </span>
                  <span className='text-muted-foreground text-[10px]'>
                    Due {format(new Date(post.dueAt), 'EEEE, d MMM yyyy')}
                  </span>
                </li>
              ))}
            </ul>
            <div className='flex justify-end pt-1'>
              <button
                onClick={() => setTab('classwork')}
                className='text-primary font-medium hover:underline text-[11px] cursor-pointer'
              >
                View all
              </button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
