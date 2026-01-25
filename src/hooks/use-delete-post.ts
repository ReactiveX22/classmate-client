import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postService } from '@/lib/api/services/post.service';
import { toast } from 'sonner';
import { handleApiError } from '@/lib/api';

export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      classroomId,
      postId,
    }: {
      classroomId: string;
      postId: string;
    }) => postService.deletePost(classroomId, postId),
    onSuccess: (_, variables) => {
      // Invalidate posts query to refetch
      queryClient.invalidateQueries({
        queryKey: ['posts', variables.classroomId],
        refetchType: 'all',
      });

      toast.success('Post deleted successfully!');
    },
    onError: (error) => {
      const errorMessage = handleApiError(error);
      toast.error(`Failed to delete post: ${errorMessage}`);
    },
  });
};
