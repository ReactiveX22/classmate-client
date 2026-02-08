'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRecentNotices } from '@/hooks/use-notices';
import { NoticeData } from '@/lib/api/services/notice.service';
import { IconBell, IconChevronRight } from '@tabler/icons-react';
import { format } from 'date-fns';
import Link from 'next/link';
import { ReactNode } from 'react';
import { TagBadge } from '../notices/tag-badge';

interface RecentNoticesProps {
  limit?: number;
  emptyAction?: ReactNode;
  emptyDescription?: string;
}

export function RecentNotices({
  limit = 6,
  emptyAction,
  emptyDescription = 'Check back later for important announcements and updates.',
}: RecentNoticesProps) {
  const { data: noticesResponse } = useRecentNotices(limit);
  const notices = noticesResponse?.data || [];

  return (
    <div className='space-y-4'>
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
        <NoticeEmptyState action={emptyAction} description={emptyDescription} />
      ) : (
        <div className='grid gap-4 sm:grid-cols-2'>
          {notices.map((item) => (
            <NoticeCard key={item.notice.id} data={item} />
          ))}
        </div>
      )}
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
      <Card className='h-full transition-colors hover:bg-muted/50 gap-2 md:py-3'>
        <CardHeader className='md:px-3'>
          <div className='space-y-2'>
            <CardTitle className='text-sm line-clamp-1 group-hover:text-primary transition-colors'>
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

function NoticeEmptyState({
  action,
  description,
}: {
  action?: ReactNode;
  description: string;
}) {
  return (
    <Card className='border-dashed shadow-none'>
      <CardContent className='flex flex-col items-center justify-center py-12 text-center'>
        <div className='p-3 rounded-full bg-primary/10 mb-4'>
          <IconBell className='h-6 w-6 text-primary' />
        </div>
        <h3 className='text-lg font-semibold'>No Notices Yet</h3>
        <p className='text-sm text-muted-foreground max-w-sm mt-1 mb-4'>
          {description}
        </p>
        {action}
      </CardContent>
    </Card>
  );
}
