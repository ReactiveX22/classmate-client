import apiClient from '../index';
import { User } from '@/types/auth';

export interface Comment {
  id: string;
  postId: string;
  content: string;
  authorId: string;
  authorName?: string;
  authorImage?: string;
  author?: User;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateCommentDto {
  content: string;
}

export const commentService = {
  getComments: async (classroomId: string, postId: string): Promise<Comment[]> => {
    const { data } = await apiClient.get<Comment[] | { data: Comment[] }>(
      `/api/v1/classrooms/${classroomId}/posts/${postId}/comments`
    );
    return Array.isArray(data) ? data : data.data;
  },

  createComment: async (
    classroomId: string,
    postId: string,
    data: CreateCommentDto
  ): Promise<Comment> => {
    const response = await apiClient.post<Comment | { data: Comment }>(
      `/api/v1/classrooms/${classroomId}/posts/${postId}/comments`,
      data
    );
    return 'data' in response.data ? response.data.data : response.data;
  },

  updateComment: async (
    classroomId: string,
    postId: string,
    commentId: string,
    data: CreateCommentDto
  ): Promise<Comment> => {
    const response = await apiClient.patch<Comment | { data: Comment }>(
      `/api/v1/classrooms/${classroomId}/posts/${postId}/comments/${commentId}`,
      data
    );
    return 'data' in response.data ? response.data.data : response.data;
  },

  deleteComment: async (
    classroomId: string,
    postId: string,
    commentId: string
  ): Promise<void> => {
    await apiClient.delete(
      `/api/v1/classrooms/${classroomId}/posts/${postId}/comments/${commentId}`
    );
  },
};
