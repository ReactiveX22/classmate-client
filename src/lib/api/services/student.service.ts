import { UserProfile } from '@/types/user';
import apiClient from '../index';
import { PaginationMeta } from '@/types/pagination';

export interface StudentData {
  student: any | null;
  userProfile: UserProfile;
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
  meta: PaginationMeta;
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
