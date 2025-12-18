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
};
