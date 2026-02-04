import { useEffect } from 'react';
import { useQueryClient, InfiniteData } from '@tanstack/react-query';
import { socketService } from '@/lib/api/services/socket.service';
import { infiniteNotificationsQueryOptions } from '@/lib/queryOptions/notificationQueryOptions';
import {
  NotificationItem,
  NotificationsResponse,
} from '@/lib/api/services/notification.service';
import { toast } from 'sonner';
import { NotificationTypeValue } from '@/lib/constants/notifications.constants';

export const useNotificationSocket = () => {
  const queryClient = useQueryClient();
  const { queryKey } = infiniteNotificationsQueryOptions();

  useEffect(() => {
    const socket = socketService.getSocket();
    if (!socket) return;

    socket.on('notification', (newNotification: NotificationItem) => {
      console.log('New notification', newNotification);
      toast.success(newNotification.notification.title, {
        description: newNotification.notification.content,
      });
      queryClient.setQueryData<InfiniteData<NotificationsResponse>>(
        queryKey,
        (oldData) => {
          if (!oldData) return undefined;

          const newPages = [...oldData.pages];

          newPages[0] = {
            ...newPages[0],
            data: [newNotification, ...newPages[0].data],
          };

          return {
            ...oldData,
            pages: newPages,
          };
        },
      );
    });

    return () => {
      socket.off('notification');
    };
  }, [queryClient, queryKey]);
};
