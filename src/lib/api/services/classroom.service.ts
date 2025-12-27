import { User } from '@/types/auth';
import apiClient from '../index';
import { PaginationMeta, PaginationParams } from '@/types/pagination';

export interface Classroom {
  id: string;
  courseId: string;
  teacherId: string;
  name: string;
  section: string;
  classCode: string;
  description: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
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
}

export interface ClassroomWithCourse {
  classroom: Classroom;
  course: Course;
}

export interface ClassroomMember {
  classroomId: string;
  studentId: string;
  joinedAt: string;
  student: User;
}

export interface ClassroomDetail extends Classroom {
  course: Course;
  teacher: User;
  classroomMembers: ClassroomMember[];
}

export interface CreateClassroomInput {
  courseId: string;
  teacherId: string;
  name: string;
  section: string;
  description?: string;
  maxStudents?: number;
}

export interface UpdateClassroomInput {
  courseId?: string;
  teacherId?: string;
  name?: string;
  section?: string;
  description?: string;
  status?: string;
}

export interface ClassroomsResponse {
  data: ClassroomWithCourse[];
  meta: PaginationMeta;
}

export const classroomService = {
  getClassrooms: async (
    params?: PaginationParams
  ): Promise<ClassroomsResponse> => {
    const response = await apiClient.get<ClassroomsResponse>(
      '/api/v1/classrooms',
      {
        params,
      }
    );
    return response.data;
  },

  getClassroomById: async (id: string): Promise<ClassroomDetail> => {
    const response = await apiClient.get<ClassroomDetail>(
      `/api/v1/classrooms/${id}`
    );
    return response.data;
  },

  createClassroom: async (
    payload: CreateClassroomInput
  ): Promise<Classroom> => {
    const response = await apiClient.post<Classroom>(
      '/api/v1/classrooms',
      payload
    );
    return response.data;
  },

  updateClassroom: async (
    id: string,
    payload: UpdateClassroomInput
  ): Promise<Classroom> => {
    const response = await apiClient.patch<Classroom>(
      `/api/v1/classrooms/${id}`,
      payload
    );
    return response.data;
  },

  deleteClassroom: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/v1/classrooms/${id}`);
  },

  addStudentsToClassroom: async (
    classroomId: string,
    studentIds: string[]
  ): Promise<void> => {
    await apiClient.post(`/api/v1/classrooms/${classroomId}/members`, {
      studentIds,
    });
  },

  removeStudentsFromClassroom: async (
    classroomId: string,
    studentIds: string[]
  ): Promise<void> => {
    await apiClient.delete(`/api/v1/classrooms/${classroomId}/members`, {
      data: { studentIds },
    });
  },
};
