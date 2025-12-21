import { UserProfile } from '@/types/user';
import apiClient from '../index';
import { PaginationMeta } from '@/types/pagination';
import { User } from '@/types/auth';

export interface CreateStudentInput {
  email: string;
  password: string;
  name: string;
  studentId?: string;
}

export interface UpdateStudentInput {
  name?: string;
  studentId?: string;
  status?: string;
}

export interface Student {
  id: string;
  userId: string;
  studentId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStudentResponse {
  user: User;
  student: Student;
}

export interface StudentData {
  student: Student | null;
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
  search?: string;
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

  createStudent: async (payload: CreateStudentInput) => {
    const response = await apiClient.post<CreateStudentResponse>(
      '/api/v1/students',
      payload
    );
    return response.data;
  },

  deleteStudent: async (id: string) => {
    const response = await apiClient.delete<Student>(`/api/v1/students/${id}`);
    return response.data;
  },

  updateStudent: async (id: string, payload: UpdateStudentInput) => {
    const response = await apiClient.patch<StudentData>(
      `/api/v1/students/${id}`,
      payload
    );
    return response.data;
  },
};
