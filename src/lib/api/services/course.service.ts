import apiClient from '../index';
import { PaginationMeta, PaginationParams } from '@/types/pagination';

export interface Course {
  id: string;
  organizationId: string;
  teacherId: string | null;
  code: string;
  title: string;
  description: string | null;
  credits: number;
  semester: string;
  maxStudents: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCourseInput {
  teacherId?: string;
  code: string;
  title: string;
  description?: string;
  credit?: number; // DTO uses 'credit'
  semester: string;
  maxStudents?: number;
}

export interface UpdateCourseInput {
  teacherId?: string;
  code?: string;
  title?: string;
  description?: string;
  credit?: number;
  semester?: string;
  maxStudents?: number;
}

export interface CoursesResponse {
  data: Course[];
  meta: PaginationMeta;
}

export const courseService = {
  getCourses: async (params?: PaginationParams): Promise<CoursesResponse> => {
    const response = await apiClient.get<CoursesResponse>('/api/v1/courses', {
      params,
    });
    return response.data;
  },

  createCourse: async (payload: CreateCourseInput): Promise<Course> => {
    const response = await apiClient.post<Course>('/api/v1/courses', payload);
    return response.data;
  },

  updateCourse: async (
    id: string,
    payload: UpdateCourseInput
  ): Promise<Course> => {
    const response = await apiClient.patch<Course>(
      `/api/v1/courses/${id}`,
      payload
    );
    return response.data;
  },

  deleteCourse: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/v1/courses/${id}`);
  },
};
