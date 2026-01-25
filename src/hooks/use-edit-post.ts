import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postService, CreatePostDto } from '@/lib/api/services/post.service';
import { toast } from 'sonner';
import { handleApiError } from '@/lib/api';

export const useEditPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      classroomId,
      postId,
      data,
    }: {
      classroomId: string;
      postId: string;
      data: Partial<CreatePostDto>;
    }) => postService.updatePost(classroomId, postId, data),
    onSuccess: (_, variables) => {
      // Invalidate posts query to refetch
      queryClient.invalidateQueries({
        queryKey: ['posts', variables.classroomId],
        refetchType: 'all',
      });

      toast.success('Post updated successfully!');
    },
    onError: (error) => {
      const errorMessage = handleApiError(error);
      toast.error(`Failed to update post: ${errorMessage}`);
    },
  });
};
