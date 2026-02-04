import {
  NotificationItem,
  NotificationsResponse,
} from '@/lib/api/services/notification.service';
import { socketService } from '@/lib/api/services/socket.service';
import { infiniteNotificationsQueryOptions } from '@/lib/queryOptions/notificationQueryOptions';
import { InfiniteData, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { useBrowserNotification } from './use-browser-notification';
import { useUser } from './useAuth';

export const useNotificationSocket = () => {
  const { data: user } = useUser();
  const queryClient = useQueryClient();
  const { queryKey } = infiniteNotificationsQueryOptions();
  const { sendBrowserNotification, requestPermission } =
    useBrowserNotification();

  useEffect(() => {
    const socket = socketService.getSocket();
    if (!socket) return;

    socket.on('notification', (newNotification: NotificationItem) => {
      if (newNotification?.actor?.id === user?.id) return;

      const { title, content } = newNotification.notification;
      toast.success(title, { description: content });

      requestPermission();
      sendBrowserNotification(title, { body: content });

      queryClient.setQueriesData<InfiniteData<NotificationsResponse>>(
        { queryKey: ['notifications'] },
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
