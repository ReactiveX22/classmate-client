import { User } from '@/types/auth';
import apiClient from '..';

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

export const teacherService = {
  createTeacher: async (payload: CreateTeacherInput) => {
    const response = await apiClient.post<CreateTeacherResponse>(
      '/api/v1/teachers',
      payload
    );
    return response.data;
  },
};
