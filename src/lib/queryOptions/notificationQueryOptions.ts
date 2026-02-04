import { PaginationParams } from '@/types/pagination';
import { infiniteQueryOptions } from '@tanstack/react-query';
import {
  notificationService,
  NotificationsResponse,
} from '../api/services/notification.service';

export function infiniteNotificationsQueryOptions(
  params?: Omit<PaginationParams, 'page'>,
) {
  return infiniteQueryOptions({
    queryKey: ['notifications', params],
    queryFn: ({ pageParam = 1 }) =>
      notificationService.getNotifications({
        ...params,
        page: pageParam as number,
      }),
    getNextPageParam: (lastPage: NotificationsResponse) => {
      return lastPage.meta.hasNextPage ? lastPage.meta.page + 1 : undefined;
    },
    initialPageParam: 1,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
}
