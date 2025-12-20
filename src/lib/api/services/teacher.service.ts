import { User } from '@/types/auth';
import apiClient from '..';
import { PaginationMeta, PaginationParams } from '@/types/pagination';
import { UserProfile } from '@/types/user';

export interface CreateTeacherInput {
  email: string;
  password: string;
  name: string;
  title?: string;
  joinDate?: string;
}

export interface UpdateTeacherInput {
  name?: string;
  title?: string;
  joinDate?: string;
  status?: string;
}

export interface Teacher {
  id: string;
  userId: string;
  title: string | null;
  joinDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTeacherResponse {
  user: User;
  teacher: Teacher;
}

export interface TeacherData {
  teacher: Teacher;
  userProfile: UserProfile;
  user: User;
}

export interface TeachersResponse {
  data: TeacherData[];
  meta: PaginationMeta;
}

export const teacherService = {
  createTeacher: async (payload: CreateTeacherInput) => {
    const response = await apiClient.post<CreateTeacherResponse>(
      '/api/v1/teachers',
      payload
    );
    return response.data;
  },

  getTeachers: async (params?: PaginationParams) => {
    const response = await apiClient.get<TeachersResponse>('/api/v1/teachers', {
      params,
    });
    return response.data;
  },

  deleteTeacher: async (id: string) => {
    const response = await apiClient.delete<Teacher>(`/api/v1/teachers/${id}`);
    return response.data;
  },

  updateTeacher: async (id: string, payload: UpdateTeacherInput) => {
    const response = await apiClient.patch<TeacherData>(
      `/api/v1/teachers/${id}`,
      payload
    );
    return response.data;
  },
};
