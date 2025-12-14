import apiClient from '../index';
import { User, Profile } from '@/types/auth';

export interface StudentData {
  student: any | null;
  userProfile: Profile;
  user: {
    id: string;
    name: string;
    email: string;
    status: string;
    createdAt: string;
  };
}

export interface StudentsResponse {
  data: StudentData[];
  meta: {
    page: string;
    limit: string;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface GetStudentsParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export const studentService = {
  getStudents: async (
    params?: GetStudentsParams
  ): Promise<StudentsResponse> => {
    const response = await apiClient.get<StudentsResponse>('/api/v1/students', {
      params,
    });
    return response.data;
  },
};
