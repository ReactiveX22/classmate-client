import apiClient from '../index';
import { PaginationMeta } from '@/types/pagination';

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
}

export interface Notice {
  id: string;
  organizationId: string;
  title: string;
  content: string | null;
  tags: string[];
  attachments: Attachment[];
  authorId: string;
  createdAt: string;
  updatedAt: string;
}

export interface NoticeAuthor {
  id: string;
  name: string;
  image: string | null;
}

export interface NoticeData {
  notice: Notice;
  author: NoticeAuthor;
}

export interface CreateNoticeInput {
  title: string;
  content?: string;
  tags?: string[];
  attachments?: Attachment[];
}

export interface UpdateNoticeInput {
  title?: string;
  content?: string;
  tags?: string[];
  attachments?: Attachment[];
}

export interface NoticesResponse {
  data: NoticeData[];
  meta: PaginationMeta;
}

export interface GetNoticesParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
}

export const noticeService = {
  getNotices: async (params?: GetNoticesParams): Promise<NoticesResponse> => {
    const response = await apiClient.get<NoticesResponse>('/api/v1/notices', {
      params,
    });
    return response.data;
  },

  getNotice: async (id: string): Promise<NoticeData> => {
    const response = await apiClient.get<NoticeData>(`/api/v1/notices/${id}`);
    return response.data;
  },

  createNotice: async (payload: CreateNoticeInput) => {
    const response = await apiClient.post<NoticeData>(
      '/api/v1/notices',
      payload,
    );
    return response.data;
  },

  updateNotice: async (id: string, payload: UpdateNoticeInput) => {
    const response = await apiClient.patch<NoticeData>(
      `/api/v1/notices/${id}`,
      payload,
    );
    return response.data;
  },

  deleteNotice: async (id: string) => {
    const response = await apiClient.delete<NoticeData>(
      `/api/v1/notices/${id}`,
    );
    return response.data;
  },

  removeAttachment: async (id: string) => {
    const response = await apiClient.delete<NoticeData>(
      `/api/v1/notices/attachments/${id}`,
    );
    return response.data;
  },
};
