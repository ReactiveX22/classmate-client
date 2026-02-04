'use client';

import { useEffect, useState, useCallback } from 'react';
import { useInView } from 'react-intersection-observer';
import { IconLoader2 } from '@tabler/icons-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { NoticeData } from '@/lib/api/services/notice.service';
import { NoticeCard } from './notice-card';
import { Skeleton } from '@/components/ui/skeleton';

interface NoticeListProps {
  notices: NoticeData[];
  isLoading: boolean;
  selectedId: string | null;
  onSelect: (id: string) => void;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  fetchNextPage?: () => void;
}

export function NoticeList({
  notices,
  isLoading,
  selectedId,
  onSelect,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
}: NoticeListProps) {
  const [scrollViewport, setScrollViewport] = useState<HTMLElement | null>(
    null,
  );

  const scrollAreaRef = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      const viewport = node.querySelector('[data-radix-scroll-area-viewport]');
      if (viewport instanceof HTMLElement) {
        setScrollViewport(viewport);
      }
    }
  }, []);

  const { ref: observerRef, inView } = useInView({
    root: scrollViewport,
    rootMargin: '100px',
    threshold: 0,
    skip: !scrollViewport,
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage && fetchNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

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
    <ScrollArea ref={scrollAreaRef} className='h-full'>
      <div className='flex flex-col gap-3 p-4'>
        {notices.map((item) => (
          <NoticeCard
            key={item.notice.id}
            notice={item}
            isSelected={selectedId === item.notice.id}
            onClick={() => onSelect(item.notice.id)}
          />
        ))}

        {/* Sentinel element for infinite scroll */}
        <div ref={observerRef} className='h-4 w-full'>
          {isFetchingNextPage && (
            <div className='flex justify-center py-2'>
              <IconLoader2 className='h-4 w-4 animate-spin text-muted-foreground' />
            </div>
          )}
        </div>
      </div>
    </ScrollArea>
  );
}
