'use client';

import { CreateClassroomDialog } from '@/components/classrooms/create-classroom-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useClassrooms } from '@/hooks/use-classrooms';
import { useUser } from '@/hooks/useAuth';
import { IconBook, IconChevronRight } from '@tabler/icons-react';
import { format } from 'date-fns';
import Link from 'next/link';
import { ClassroomCard } from './classroom-card';
import { DashboardSkeleton } from './dashboard-skeleton';
import { RecentNotices } from './recent-notices';

export function TeacherDashboard() {
  const { data: classroomsResponse, isLoading } = useClassrooms({
    limit: 50,
  });
  const { data: user } = useUser();

  const classrooms = classroomsResponse?.data || [];

  const allUpcomingPosts = classrooms.flatMap((c) =>
    (c.upcoming || []).map((p) => ({
      ...p,
      classroomId: c.classroom.id,
      classroomName: c.classroom.name,
    })),
  );

  const upcomingDeadlines = allUpcomingPosts
    .sort((a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime())
    .slice(0, 5);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className='container mx-auto p-6 space-y-8 animate-in fade-in duration-500'>
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
        <div className='space-y-1'>
          <h1 className='text-xl font-semibold tracking-tight'>
            Welcome, {user?.name}
          </h1>
          <p className='text-muted-foreground'>
            {format(new Date(), 'EEEE, MMMM do, yyyy')}
          </p>
        </div>
        <CreateClassroomDialog />
      </div>

      <div className='grid gap-6 lg:grid-cols-3'>
        <div className='lg:col-span-2 space-y-8'>
          <div className='space-y-4'>
            <div className='flex items-center justify-between'>
              <h2 className='font-medium tracking-tight'>Your Classes</h2>
              <Button
                variant='link'
                className='px-0 h-auto'
                nativeButton={false}
                render={<Link href='/dashboard/classrooms' />}
              >
                View All <IconChevronRight className='ml-1 h-4 w-4' />
              </Button>
            </div>

            {classrooms.length === 0 ? (
              <EmptyState />
            ) : (
              <div className='grid gap-4 sm:grid-cols-2'>
                {classrooms.map((item) => (
                  <ClassroomCard key={item.classroom.id} data={item} />
                ))}
              </div>
            )}
          </div>

          <RecentNotices />
        </div>

        <div className='space-y-4'>
          <h2 className='font-medium tracking-tight'>Upcoming</h2>
          <Card className='p-0 md:py-0'>
            <CardContent className='p-0 md:px-0'>
              <ScrollArea className='max-h-[400px]'>
                {upcomingDeadlines.length === 0 ? (
                  <div className='p-8 text-center text-muted-foreground text-sm'>
                    No upcoming deadlines.
                  </div>
                ) : (
                  <div className='divide-y'>
                    {upcomingDeadlines.map((post) => (
                      <Link
                        key={post.id}
                        href={`/dashboard/classrooms/${post.classroomId}/assignments/${post.id}`}
                        className='group block p-4 hover:bg-muted/50 transition-colors'
                      >
                        <div className='space-y-1'>
                          <div className='flex items-center justify-between gap-2'>
                            <span className='font-medium text-sm line-clamp-1 group-hover:text-primary transition-colors'>
                              {post.title}
                            </span>
                            <p className='text-xs text-muted-foreground pt-1'>
                              Due{' '}
                              {format(new Date(post.dueAt), 'MMM d, h:mm a')}
                            </p>
                          </div>
                          <p className='text-xs text-muted-foreground line-clamp-1'>
                            {post.classroomName}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <Card className='border-dashed shadow-none'>
      <CardContent className='flex flex-col items-center justify-center py-12 text-center'>
        <div className='p-3 rounded-full bg-primary/10 mb-4'>
          <IconBook className='h-6 w-6 text-primary' />
        </div>
        <h3 className='text-lg font-semibold'>No Classes Yet</h3>
        <p className='text-sm text-muted-foreground max-w-sm mt-1 mb-4'>
          Get started by creating your first class.
        </p>
        <CreateClassroomDialog />
      </CardContent>
    </Card>
  );
}
