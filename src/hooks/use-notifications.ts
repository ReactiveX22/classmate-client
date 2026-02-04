import {
  InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { infiniteNotificationsQueryOptions } from '@/lib/queryOptions/notificationQueryOptions';
import { PaginationParams } from '@/types/pagination';
import {
  notificationService,
  NotificationsResponse,
} from '@/lib/api/services/notification.service';

export const useNotifications = (params?: Omit<PaginationParams, 'page'>) => {
  return useInfiniteQuery(infiniteNotificationsQueryOptions(params));
};

export const useMarkAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => notificationService.markAsRead(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['notifications'] });
      const previousNotifications = queryClient.getQueryData<
        InfiniteData<NotificationsResponse>
      >(['notifications']);

      queryClient.setQueriesData<InfiniteData<NotificationsResponse>>(
        { queryKey: ['notifications'] },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              data: page.data.map((item) =>
                item.notification.id === id ? { ...item, isRead: true } : item,
              ),
            })),
          };
        },
      );

      return { previousNotifications };
    },
    onError: (_err, _id, context) => {
      if (context?.previousNotifications) {
        queryClient.setQueryData(
          ['notifications'],
          context.previousNotifications,
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};

export const useMarkAllAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => notificationService.markAllAsRead(),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['notifications'] });
      const previousNotifications = queryClient.getQueryData<
        InfiniteData<NotificationsResponse>
      >(['notifications']);

      queryClient.setQueriesData<InfiniteData<NotificationsResponse>>(
        { queryKey: ['notifications'] },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              data: page.data.map((item) => ({ ...item, isRead: true })),
            })),
          };
        },
      );

      return { previousNotifications };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousNotifications) {
        queryClient.setQueryData(
          ['notifications'],
          context.previousNotifications,
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};
