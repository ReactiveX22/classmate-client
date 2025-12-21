import { User } from '@/types/auth';
import apiClient from '../index';
import { PaginationMeta, PaginationParams } from '@/types/pagination';

export interface Enrollment {
  studentId: string;
  courseId: string;
  enrollAt: string;
  student: {
    id: string;
    userId: string;
    studentId: string | null;
    createdAt: string;
    updatedAt: string;
    user: User;
  };
}

export interface Course {
  id: string;
  organizationId: string;
  teacherId: string | null;
  code: string;
  title: string;
  description: string | null;
  credits: number;
  semester: string;
  status: string;
  maxStudents: number;
  createdAt: string;
  updatedAt: string;
  teacher?: {
    id: string;
    userId: string;
    title: string | null;
    joinDate: string | null;
    createdAt: string;
    updatedAt: string;
    user: User;
  };
  enrollment?: Enrollment[];
}

export interface CreateCourseInput {
  teacherId?: string;
  code: string;
  title: string;
  description?: string;
  credits?: number;
  semester: string;
  maxStudents?: number;
}

export interface UpdateCourseInput {
  teacherId?: string;
  code?: string;
  title?: string;
  description?: string;
  credits?: number;
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

  getCourseById: async (id: string): Promise<Course> => {
    const response = await apiClient.get<Course>(`/api/v1/courses/${id}`);
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
