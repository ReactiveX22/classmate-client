import { useInfiniteQuery } from '@tanstack/react-query';
import { infiniteNotificationsQueryOptions } from '@/lib/queryOptions/notificationQueryOptions';
import { PaginationParams } from '@/types/pagination';

export const useNotifications = (params?: Omit<PaginationParams, 'page'>) => {
  return useInfiniteQuery(infiniteNotificationsQueryOptions(params));
};
