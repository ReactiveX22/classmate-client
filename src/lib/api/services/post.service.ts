import apiClient from "../index";
import { PaginationMeta, PaginationParams } from "@/types/pagination";
import { User } from "@/types/auth";
import { Submission } from "./submission.service";

export type PostType = "announcement" | "assignment" | "material" | "question";
export type AttachmentType = "file" | "link" | "video" | "image";
export type SubmissionType = "file" | "text" | "link" | "multiple";
export type PollSelectionMode = "single" | "multiple";

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

export type SubmissionStats = {
  total: number;
  graded: number;
};

export type PollOption = {
  id: string;
  text: string;
  position: number;
};

export type PollVote = {
  userId: string;
  optionIds: string[];
  votedAt: string;
};

export type PollViewer = {
  id: string;
  name: string | null;
  image: string | null;
};

export type PollResult = {
  optionId: string;
  voteCount: number;
  percentage: number;
  voters?: PollViewer[];
};

export type ShortAnswerQuestionData = {
  mode: "short_answer";
};

export type PollQuestionData = {
  mode: "poll";
  selectionMode: PollSelectionMode;
  options: PollOption[];
  votes?: PollVote[];
  viewerVoteOptionIds?: string[];
  totalVotes?: number;
  results?: PollResult[];
  canViewVoters?: boolean;
};

export type QuestionData = ShortAnswerQuestionData | PollQuestionData;

export interface Post {
  id: string;
  classroomId: string;
  authorId: string;
  type: PostType;
  title: string | null;
  content: string;
  attachments: Attachment[];
  assignmentData: AssignmentData | null;
  questionData?: QuestionData | null;
  isPinned: boolean;
  commentsEnabled: boolean;
  tags: string[];
  isBookmarked?: boolean;
  createdAt: string;
  updatedAt: string;
  author?: User;
  submission?: Submission | null;
  submissionStats?: SubmissionStats | null;
  authorName: string;
}

export interface PostsResponse {
  data: Post[];
  meta: PaginationMeta;
}

export interface PostsQueryParams extends PaginationParams {
  type?: PostType;
  tags?: string[];
  bookmarked?: boolean;
  fromInstructor?: boolean;
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
  type: PostType;
  title?: string;
  content: string;
  attachments?: AttachmentDto[];
  assignmentData?: AssignmentDataDto;
  questionData?: QuestionData;
  isPinned?: boolean;
  commentsEnabled?: boolean;
  tags?: string[];
}

export interface VotePollDto {
  optionIds: string[];
}

export const postService = {
  getPosts: async (
    classroomId: string,
    params?: PostsQueryParams,
  ): Promise<PostsResponse> => {
    const response = await apiClient.get<PostsResponse>(
      `/api/v1/classrooms/${classroomId}/posts`,
      {
        params,
      },
    );
    return response.data;
  },

  createPost: async (
    classroomId: string,
    data: CreatePostDto,
  ): Promise<Post> => {
    const response = await apiClient.post<Post>(
      `/api/v1/classrooms/${classroomId}/posts`,
      data,
    );
    return response.data;
  },

  removeAttachment: async (
    classroomId: string,
    attachmentId: string,
  ): Promise<void> => {
    await apiClient.delete(
      `/api/v1/classrooms/${classroomId}/posts/upload/${attachmentId}`,
    );
  },

  deletePost: async (classroomId: string, postId: string): Promise<void> => {
    await apiClient.delete(`/api/v1/classrooms/${classroomId}/posts/${postId}`);
  },

  updatePost: async (
    classroomId: string,
    postId: string,
    data: Partial<CreatePostDto>,
  ): Promise<Post> => {
    const response = await apiClient.patch<Post>(
      `/api/v1/classrooms/${classroomId}/posts/${postId}`,
      data,
    );
    return response.data;
  },

  getPost: async (classroomId: string, postId: string): Promise<Post> => {
    const response = await apiClient.get<Post>(
      `/api/v1/classrooms/${classroomId}/posts/${postId}`,
    );
    return response.data;
  },

  voteOnPoll: async (
    classroomId: string,
    postId: string,
    data: VotePollDto,
  ): Promise<Post> => {
    const response = await apiClient.put<Post>(
      `/api/v1/classrooms/${classroomId}/posts/${postId}/poll-vote`,
      data,
    );
    return response.data;
  },

  bookmarkPost: async (classroomId: string, postId: string): Promise<void> => {
    await apiClient.post(
      `/api/v1/classrooms/${classroomId}/posts/${postId}/bookmark`,
    );
  },

  unbookmarkPost: async (
    classroomId: string,
    postId: string,
  ): Promise<void> => {
    await apiClient.delete(
      `/api/v1/classrooms/${classroomId}/posts/${postId}/bookmark`,
    );
  },
};
