import apiClient from '../index';
import { Attachment, AttachmentDto } from './post.service';
import { User } from '@/types/auth';
import { PaginationParams } from '@/types/pagination';

export type SubmissionStatus = 'assigned' | 'turned_in' | 'graded' | 'returned';

export interface Submission {
  id: string;
  postId: string;
  studentId: string;
  content?: string;
  attachments: Attachment[];
  status: SubmissionStatus;
  grade?: number;
  feedback?: string;
  submittedAt: string;
  createdAt: string;
  updatedAt: string;
  student?: User;
}

export interface CreateSubmissionDto {
  content?: string;
  attachments?: AttachmentDto[];
}

export const submissionService = {
  createSubmission: async (
    classroomId: string,
    postId: string,
    data: CreateSubmissionDto
  ): Promise<Submission> => {
    const response = await apiClient.post<Submission>(
      `/api/v1/classrooms/${classroomId}/posts/${postId}/submissions`,
      data
    );
    return response.data;
  },

  getMySubmission: async (
    classroomId: string,
    postId: string
  ): Promise<Submission | null> => {
    try {
      const response = await apiClient.get<Submission>(
        `/api/v1/classrooms/${classroomId}/posts/${postId}/submissions`
      );
      return response.data;
    } catch {
      return null;
    }
  },

  unsubmit: async (
    classroomId: string,
    postId: string
  ): Promise<Submission> => {
    const response = await apiClient.patch<Submission>(
      `/api/v1/classrooms/${classroomId}/posts/${postId}/submissions/unsubmit`
    );
    return response.data;
  },

  removeAttachment: async (
    classroomId: string,
    postId: string,
    attachmentId: string
  ): Promise<void> => {
    await apiClient.delete(
      `/api/v1/classrooms/${classroomId}/posts/${postId}/submissions/upload/${attachmentId}`
    );
  },

  getSubmissions: async (
    classroomId: string,
    postId: string,
    params?: PaginationParams
  ): Promise<{
    data: Submission[];
    meta: {
      page: number;
      limit: number;
      totalItems: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  }> => {
    const response = await apiClient.get(
      `/api/v1/classrooms/${classroomId}/posts/${postId}/submissions`,
      { params }
    );
    return response.data;
  },

  gradeSubmission: async (
    classroomId: string,
    postId: string,
    studentId: string,
    grade: number,
    feedback?: string
  ): Promise<Submission> => {
    const response = await apiClient.patch<Submission>(
      `/api/v1/classrooms/${classroomId}/posts/${postId}/submissions/students/${studentId}/grade`,
      { grade, ...(feedback && { feedback }) }
    );
    return response.data;
  },

  returnSubmission: async (
    classroomId: string,
    postId: string,
    submissionId: string
  ): Promise<Submission> => {
    const response = await apiClient.patch<Submission>(
      `/api/v1/classrooms/${classroomId}/posts/${postId}/submissions/${submissionId}/return`
    );
    return response.data;
  },
};
