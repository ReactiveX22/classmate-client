'use client';

import { JoinClassroomDialog } from '@/components/classrooms/join-classroom-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { useClassrooms } from '@/hooks/use-classrooms';
import { useUser } from '@/hooks/useAuth';
import { ClassroomWithCourse } from '@/lib/api/services/classroom.service';
import { IconBook, IconChevronRight } from '@tabler/icons-react';
import { format } from 'date-fns';
import Link from 'next/link';

export function StudentDashboard() {
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
        <JoinClassroomDialog />
      </div>

      <div className='grid gap-6 lg:grid-cols-3'>
        <div className='lg:col-span-2 space-y-4'>
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

        <div className='space-y-4'>
          <h2 className='font-medium tracking-tight'>Upcoming</h2>
          <Card className='p-0'>
            <CardContent className='p-0'>
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

function ClassroomCard({ data }: { data: ClassroomWithCourse }) {
  const { classroom, course } = data;

  return (
    <Link
      href={`/dashboard/classrooms/${classroom.id}`}
      className='group block h-full'
    >
      <Card className='h-full transition-colors hover:bg-muted/50 gap-2'>
        <CardHeader>
          <div className='space-y-1'>
            <CardTitle className='text-base font-semibold line-clamp-1 group-hover:text-primary transition-colors'>
              {classroom.name}
            </CardTitle>
            <p className='text-xs text-muted-foreground'>
              {course.code} • {classroom.section} • {course.credits} Credits
            </p>
          </div>
        </CardHeader>
      </Card>
    </Link>
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
          You aren't enrolled in any classes yet.
        </p>
        <Button
          render={<Link href='/dashboard/classrooms/join'>Join Class</Link>}
          nativeButton={false}
        />
      </CardContent>
    </Card>
  );
}

function DashboardSkeleton() {
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
