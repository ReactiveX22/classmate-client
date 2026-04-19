'use client';

import { JoinClassroomDialog } from '@/components/classrooms/join-classroom-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useClassrooms } from '@/hooks/use-classrooms';
import { useUser } from '@/hooks/useAuth';
import { format } from 'date-fns';
import Link from 'next/link';
import { ClassroomCard } from './classroom-card';
import { DashboardSkeleton } from './dashboard-skeleton';
import { RecentNotices } from './recent-notices';
import { UpcomingSection } from './upcoming-section';
import { LayoutGrid, Calendar, ChevronRight, Book } from 'lucide-react';

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
        <div className='lg:col-span-2 space-y-8'>
          <div className='space-y-4'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <div className='p-2 rounded-xl bg-primary/10 text-primary'>
                  <LayoutGrid size={20} />
                </div>
                <div className='space-y-0.5'>
                  <h2 className='text-lg font-bold tracking-tight'>Your Classes</h2>
                  <p className='text-xs text-muted-foreground'>
                    You are enrolled in {classrooms.length} classes
                  </p>
                </div>
              </div>
              <Button
                variant='ghost'
                size='sm'
                className='h-8'
                nativeButton={false}
                render={<Link href='/dashboard/classrooms' />}
              >
                View All <ChevronRight className='ml-1 h-3 w-3' />
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


        <UpcomingSection 
          items={upcomingDeadlines} 
          subtext={`${upcomingDeadlines.length} tasks due soon`}
        />
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <Card className='border-dashed shadow-none'>
      <CardContent className='flex flex-col items-center justify-center py-12 text-center'>
        <div className='p-3 rounded-full bg-primary/10 mb-4'>
          <Book className='h-6 w-6 text-primary' />
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
