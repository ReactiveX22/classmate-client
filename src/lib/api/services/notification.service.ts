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
  createdAt: string;
}

export interface NotificationItem {
  notification: NotificationContent;
  actor: NotificationActor;
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
};
