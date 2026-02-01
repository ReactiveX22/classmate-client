'use client';

import { useEffect, useCallback, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useNotifications } from '@/hooks/use-notifications';
import { formatDistanceToNow } from 'date-fns';
import { IconBell, IconLoader2 } from '@tabler/icons-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button, buttonVariants } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { NotificationItem } from '@/lib/api/services/notification.service';

export function NotificationPopover() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useNotifications({ limit: 10 });

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
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const notifications = data?.pages.flatMap((page) => page.data) || [];

  return (
    <Popover>
      <PopoverTrigger
        className={cn(
          buttonVariants({ variant: 'ghost', size: 'icon' }),
          'relative',
        )}
      >
        <IconBell size={20} />
      </PopoverTrigger>
      <PopoverContent className='w-80 p-0 gap-0' align='end'>
        <div className='flex items-center justify-between border-b px-4 py-3'>
          <h4 className='font-semibold'>Notifications</h4>
        </div>
        <ScrollArea ref={scrollAreaRef} className='h-80 w-full'>
          {isLoading ? (
            <div className='flex h-40 items-center justify-center'>
              <IconLoader2 className='animate-spin text-muted-foreground' />
            </div>
          ) : isError ? (
            <div className='flex h-40 items-center justify-center text-sm text-red-500'>
              Failed to load notifications
            </div>
          ) : notifications.length === 0 ? (
            <div className='flex h-40 items-center justify-center text-sm text-muted-foreground'>
              No notifications
            </div>
          ) : (
            <div className='flex flex-col'>
              {notifications.map((item) => (
                <NotificationItemRow key={item.notification.id} item={item} />
              ))}

              {/* Sentinel element for infinite scroll */}
              <div ref={observerRef} className='h-4 w-full'>
                {isFetchingNextPage && (
                  <div className='flex justify-center py-2'>
                    <IconLoader2 className='h-4 w-4 animate-spin text-muted-foreground' />
                  </div>
                )}
              </div>

              {/* End of list indicator */}
              {!hasNextPage && notifications.length > 0 && (
                <p className='text-center text-xs text-muted-foreground py-2'>
                  No more notifications
                </p>
              )}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}

function NotificationItemRow({ item }: { item: NotificationItem }) {
  const { notification, actor } = item;

  return (
    <div className='flex items-start gap-4 border-b px-4 py-3 last:border-0 hover:bg-muted/50'>
      <Avatar className='h-8 w-8 mt-1'>
        <AvatarImage src={actor.image || undefined} alt={actor.name} />
        <AvatarFallback>{actor.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className='flex-1 space-y-1'>
        <p className='text-sm font-medium leading-none'>{notification.title}</p>
        <p className='text-sm text-muted-foreground line-clamp-2'>
          {notification.content}
        </p>
        <p className='text-xs text-muted-foreground'>
          {formatDistanceToNow(new Date(notification.createdAt), {
            addSuffix: true,
          })}
        </p>
      </div>
    </div>
  );
}
