import apiClient from '../index';
import { PaginationMeta, PaginationParams } from '@/types/pagination';
import { User } from '@/types/auth';

export type PostType = 'announcement' | 'assignment' | 'material' | 'question';
export type AttachmentType = 'file' | 'link' | 'video' | 'image';
export type SubmissionType = 'file' | 'text' | 'link' | 'multiple';

export type Attachment = {
  id: string;
  name: string;
  url: string;
  type: AttachmentType;
  size?: number;
  mimeType?: string;
};

export type AssignmentData = {
  dueDate?: string;
  points?: number;
  allowLateSubmission?: boolean;
  submissionType?: SubmissionType;
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

// DTO for creating a post
export interface AttachmentDto {
  name: string;
  url: string;
  type: AttachmentType;
  size?: number;
  mimeType?: string;
}

export interface AssignmentDataDto {
  dueDate?: string;
  points?: number;
  allowLateSubmission?: boolean;
  submissionType?: SubmissionType;
}

export interface CreatePostDto {
  classroomId: string;
  type: PostType;
  title?: string;
  content: string;
  attachments?: AttachmentDto[];
  assignmentData?: AssignmentDataDto;
  isPinned?: boolean;
  commentsEnabled?: boolean;
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

  createPost: async (data: CreatePostDto): Promise<Post> => {
    const response = await apiClient.post<Post>('/api/v1/posts', data);
    return response.data;
  },
};
