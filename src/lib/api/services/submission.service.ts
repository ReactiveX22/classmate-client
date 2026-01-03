import apiClient from '../index';
import { Attachment, AttachmentDto } from './post.service';
import { User } from '@/types/auth';

export type SubmissionStatus = 'submitted' | 'late' | 'graded' | 'returned';

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
};
