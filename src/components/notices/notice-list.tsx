'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import { NoticeData } from '@/lib/api/services/notice.service';
import { NoticeCard } from './notice-card';
import { Skeleton } from '@/components/ui/skeleton';

interface NoticeListProps {
  notices: NoticeData[];
  isLoading: boolean;
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function NoticeList({
  notices,
  isLoading,
  selectedId,
  onSelect,
}: NoticeListProps) {
  if (isLoading) {
    return (
      <div className='flex flex-col gap-3 p-4'>
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className='flex flex-col gap-2 p-4 border rounded-xl bg-card/50'
          >
            <Skeleton className='h-5 w-3/4' />
            <div className='flex gap-2'>
              <Skeleton className='h-3 w-1/4' />
              <Skeleton className='h-3 w-1/4' />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (notices.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center p-8 text-center h-[300px] text-muted-foreground'>
        <p>No notices found.</p>
      </div>
    );
  }

  return (
    <ScrollArea className='h-full'>
      <div className='flex flex-col gap-3 p-4'>
        {notices.map((item) => (
          <NoticeCard
            key={item.notice.id}
            notice={item}
            isSelected={selectedId === item.notice.id}
            onClick={() => onSelect(item.notice.id)}
          />
        ))}
      </div>
    </ScrollArea>
  );
}
