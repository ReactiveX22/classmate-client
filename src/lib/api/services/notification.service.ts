import apiClient from '../index';
import { PaginationMeta, PaginationParams } from '@/types/pagination';

export interface NotificationActor {
  id: string;
  name: string;
  image: string | null;
}

export interface NotificationContent {
  id: string;
  organizationId: string;
  title: string;
  content: string;
  type: string;
  recipientId: string | null;
  actorId: string;
  entityId: string;
  meta?: {
    postId?: string;
  };
  createdAt: string;
}

export interface NotificationItem {
  notification: NotificationContent;
  actor: NotificationActor | null;
  readAt: string | null;
  isRead: boolean;
}

export interface NotificationsResponse {
  data: NotificationItem[];
  meta: PaginationMeta;
}

export const notificationService = {
  getNotifications: async (
    params?: PaginationParams,
  ): Promise<NotificationsResponse> => {
    const response = await apiClient.get<NotificationsResponse>(
      '/api/v1/notifications',
      {
        params,
      },
    );
    return response.data;
  },
  markAsRead: async (id: string): Promise<void> => {
    await apiClient.patch(`/api/v1/notifications/${id}/read`);
  },
  markAllAsRead: async (): Promise<void> => {
    await apiClient.patch('/api/v1/notifications/read-all');
  },
};
