import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { commentService, CreateCommentDto } from '@/lib/api/services/comment.service';
import { toast } from 'sonner';
import { handleApiError } from '@/lib/api';

export const useComments = (classroomId: string, postId: string) => {
  return useQuery({
    queryKey: ['comments', classroomId, postId],
    queryFn: () => commentService.getComments(classroomId, postId),
    enabled: !!classroomId && !!postId,
  });
};

export const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      classroomId,
      postId,
      data,
    }: {
      classroomId: string;
      postId: string;
      data: CreateCommentDto;
    }) => commentService.createComment(classroomId, postId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['comments', variables.classroomId, variables.postId],
      });
    },
    onError: (error) => {
      const errorMessage = handleApiError(error);
      toast.error(`Failed to post comment: ${errorMessage}`);
    },
  });
};

export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      classroomId,
      postId,
      commentId,
    }: {
      classroomId: string;
      postId: string;
      commentId: string;
    }) => commentService.deleteComment(classroomId, postId, commentId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['comments', variables.classroomId, variables.postId],
      });
      toast.success('Comment deleted');
    },
    onError: (error) => {
      const errorMessage = handleApiError(error);
      toast.error(`Failed to delete comment: ${errorMessage}`);
    },
  });
};

export const useUpdateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      classroomId,
      postId,
      commentId,
      data,
    }: {
      classroomId: string;
      postId: string;
      commentId: string;
      data: CreateCommentDto;
    }) => commentService.updateComment(classroomId, postId, commentId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['comments', variables.classroomId, variables.postId],
      });
      toast.success('Comment updated');
    },
    onError: (error) => {
      const errorMessage = handleApiError(error);
      toast.error(`Failed to update comment: ${errorMessage}`);
    },
  });
};
