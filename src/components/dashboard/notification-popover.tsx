'use client';

import { buttonVariants } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNotifications } from '@/hooks/use-notifications';
import { NotificationItem } from '@/lib/api/services/notification.service';
import { NotificationType } from '@/lib/constants/notifications.constants';
import { cn } from '@/lib/utils';
import {
  IconAward,
  IconBell,
  IconClipboardText,
  IconInfoCircle,
  IconLoader2,
  IconSpeakerphone,
} from '@tabler/icons-react';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

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
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <Popover>
      <PopoverTrigger
        className={cn(
          buttonVariants({ variant: 'ghost', size: 'icon' }),
          'relative',
        )}
      >
        <IconBell size={20} />
        {unreadCount > 0 && (
          <span className='absolute top-1.5 right-1.5 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-primary ring-2 ring-background'>
            <span className='sr-only'>{unreadCount} unread notifications</span>
          </span>
        )}
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
  const { notification } = item;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case NotificationType.CLASSROOM.ASSIGNMENT:
        return <IconClipboardText className='h-4 w-4 text-orange-500' />;
      case NotificationType.CLASSROOM.GRADE:
        return <IconAward className='h-4 w-4 text-yellow-500' />;
      case NotificationType.ORGANIZATION.NOTICE:
        return <IconSpeakerphone className='h-4 w-4 text-blue-500' />;
      default:
        return <IconInfoCircle className='h-4 w-4 text-muted-foreground' />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case NotificationType.CLASSROOM.ASSIGNMENT:
        return 'bg-orange-500/10 border-orange-500/20';
      case NotificationType.CLASSROOM.GRADE:
        return 'bg-yellow-500/10 border-yellow-500/20';
      case NotificationType.ORGANIZATION.NOTICE:
        return 'bg-blue-500/10 border-blue-500/20';
      default:
        return 'bg-muted border-border';
    }
  };

  const getNotificationLink = (type: string, entityId: string) => {
    // TODO: handle other notification types
    switch (type) {
      case NotificationType.CLASSROOM.ASSIGNMENT:
        return `/classroom/assignment/${entityId}`;
      case NotificationType.CLASSROOM.GRADE:
        return `/classroom/grade/${entityId}`;
      case NotificationType.ORGANIZATION.NOTICE:
        return `/dashboard/notices?id=${entityId}`;
      default:
        return '/';
    }
  };

  return (
    <Link href={getNotificationLink(notification.type, notification.entityId)}>
      <div
        className={cn(
          'cursor-pointer flex items-start gap-4 border-b px-4 py-3 last:border-0 hover:bg-muted/50 transition-colors relative',
          !item.isRead && 'bg-primary/5 hover:bg-primary/10',
        )}
      >
        <div
          className={cn(
            'mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border',
            getNotificationColor(notification.type),
          )}
        >
          {getNotificationIcon(notification.type)}
        </div>
        <div className='flex-1 space-y-1'>
          <div className='flex justify-between items-start gap-2'>
            <p
              className={cn(
                'text-sm leading-normal flex-1',
                !item.isRead ? 'font-semibold' : 'font-medium',
              )}
            >
              {notification.title}
            </p>
            {!item.isRead && (
              <span className='h-2 w-2 rounded-full bg-primary shrink-0 mt-1.5' />
            )}
          </div>
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
    </Link>
  );
}
