import apiClient from '../index';
import { PaginationMeta, PaginationParams } from '@/types/pagination';

export interface CourseSession {
  id: string;
  organizationId: string;
  name: string;
  description: string | null;
  startDate: string | null;
  endDate: string | null;
  isCurrent: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCourseSessionInput {
  name: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  isCurrent?: boolean;
}

export interface UpdateCourseSessionInput {
  name?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  isCurrent?: boolean;
}

export interface CourseSessionsResponse {
  data: CourseSession[];
  meta: PaginationMeta;
}

export const courseSessionService = {
  getCourseSessions: async (
    params?: PaginationParams,
  ): Promise<CourseSessionsResponse> => {
    const response = await apiClient.get<CourseSessionsResponse>(
      '/api/v1/course-sessions',
      {
        params,
      },
    );
    return response.data;
  },

  getCourseSessionById: async (id: string): Promise<CourseSession> => {
    const response = await apiClient.get<CourseSession>(
      `/api/v1/course-sessions/${id}`,
    );
    return response.data;
  },

  createCourseSession: async (
    payload: CreateCourseSessionInput,
  ): Promise<CourseSession> => {
    const response = await apiClient.post<CourseSession>(
      '/api/v1/course-sessions',
      payload,
    );
    return response.data;
  },

  updateCourseSession: async (
    id: string,
    payload: UpdateCourseSessionInput,
  ): Promise<CourseSession> => {
    const response = await apiClient.patch<CourseSession>(
      `/api/v1/course-sessions/${id}`,
      payload,
    );
    return response.data;
  },

  deleteCourseSession: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/v1/course-sessions/${id}`);
  },
};
