import apiClient from '../index';
import { PaginationMeta, PaginationParams } from '@/types/pagination';
import { User } from '@/types/auth';

export type PostType = 'announcement' | 'assignment' | 'material' | 'question';

export type Attachment = {
  id: string;
  name: string;
  url: string;
  type: 'file' | 'link' | 'video' | 'image';
  size?: number;
  mimeType?: string;
};

export type AssignmentData = {
  dueDate?: string;
  points?: number;
  allowLateSubmission?: boolean;
  submissionType?: 'file' | 'text' | 'link' | 'multiple';
};

export interface Post {
  id: string;
  classroomId: string;
  authorId: string;
  type: PostType;
  title: string | null;
  content: string;
  attachments: Attachment[];
  assignmentData: AssignmentData | null;
  isPinned: boolean;
  commentsEnabled: boolean;
  createdAt: string;
  updatedAt: string;
  author?: User;
}

export interface PostsResponse {
  data: Post[];
  meta: PaginationMeta;
}

export const postService = {
  getPosts: async (
    classroomId: string,
    params?: PaginationParams
  ): Promise<PostsResponse> => {
    const response = await apiClient.get<PostsResponse>(
      `/api/v1/classrooms/${classroomId}/posts`,
      {
        params,
      }
    );
    return response.data;
  },
};
