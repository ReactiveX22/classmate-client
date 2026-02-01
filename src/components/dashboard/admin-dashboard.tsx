'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { useRecentNotices } from '@/hooks/use-notices';
import { useUser } from '@/hooks/useAuth';
import { NoticeData } from '@/lib/api/services/notice.service';
import { IconBell, IconChevronRight, IconCalendar } from '@tabler/icons-react';
import { format } from 'date-fns';
import Link from 'next/link';
import { AddNoticeDialog } from '../notices/add-notice-dialog';
import { TagBadge } from '../notices/tag-badge';

export function AdminDashboard() {
  const { data: noticesResponse, isLoading } = useRecentNotices(5);
  const { data: user } = useUser();

  const notices = noticesResponse?.data || [];

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
        <AddNoticeDialog />
      </div>

      <div className='grid gap-6 lg:grid-cols-3'>
        <div className='lg:col-span-2 space-y-4'>
          <div className='flex items-center justify-between'>
            <h2 className='font-medium tracking-tight'>Latest Notices</h2>
            <Button
              variant='link'
              className='px-0 h-auto'
              nativeButton={false}
              render={<Link href='/dashboard/notices' />}
            >
              View All <IconChevronRight className='ml-1 h-4 w-4' />
            </Button>
          </div>

          {notices.length === 0 ? (
            <EmptyState />
          ) : (
            <div className='grid gap-4 sm:grid-cols-2'>
              {notices.map((item) => (
                <NoticeCard key={item.notice.id} data={item} />
              ))}
            </div>
          )}
        </div>

        <div className='space-y-4'>
          <h2 className='font-medium tracking-tight'>Upcoming</h2>
          <Card className='p-0'>
            <CardContent className='p-0'>
              <ScrollArea className='max-h-[400px]'>
                <div className='p-8 text-center text-muted-foreground text-sm'>
                  <IconCalendar className='h-8 w-8 mx-auto mb-2 opacity-50' />
                  No upcoming events.
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function NoticeCard({ data }: { data: NoticeData }) {
  const { notice, author } = data;

  return (
    <Link
      href={`/dashboard/notices?id=${notice.id}`}
      className='group block h-full'
    >
      <Card className='h-full transition-colors hover:bg-muted/50 gap-2'>
        <CardHeader>
          <div className='space-y-2'>
            <CardTitle className='text-base font-semibold line-clamp-1 group-hover:text-primary transition-colors'>
              {notice.title}
            </CardTitle>
            <p className='text-xs text-muted-foreground'>
              By {author?.name || 'Admin'} •{' '}
              {format(new Date(notice.createdAt), 'MMM d, yyyy')}
            </p>
            {notice.tags && notice.tags.length > 0 && (
              <div className='flex flex-wrap gap-1.5'>
                {notice.tags.slice(0, 2).map((tag) => (
                  <TagBadge
                    key={tag}
                    tag={tag}
                    className='text-[10px] px-1.5 h-5'
                  />
                ))}
                {notice.tags.length > 2 && (
                  <span className='text-[10px] text-muted-foreground self-center px-1'>
                    +{notice.tags.length - 2}
                  </span>
                )}
              </div>
            )}
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
          <IconBell className='h-6 w-6 text-primary' />
        </div>
        <h3 className='text-lg font-semibold'>No Notices Yet</h3>
        <p className='text-sm text-muted-foreground max-w-sm mt-1 mb-4'>
          Get started by creating your first notice.
        </p>
        <AddNoticeDialog />
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
