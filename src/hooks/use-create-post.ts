import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postService, CreatePostDto } from '@/lib/api/services/post.service';
import { toast } from 'sonner';
import { handleApiError } from '@/lib/api';

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      classroomId,
      data,
    }: {
      classroomId: string;
      data: CreatePostDto;
    }) => postService.createPost(classroomId, data),
    onSuccess: (_, variables) => {
      // Invalidate posts query to refetch
      queryClient.invalidateQueries({
        queryKey: ['posts', variables.classroomId],
        refetchType: 'all',
      });

      // Invalidate classrooms query to update dashboard and upcoming lists
      queryClient.invalidateQueries({
        queryKey: ['classrooms'],
        refetchType: 'all',
      });

      // Invalidate specific upcoming posts for this classroom
      queryClient.invalidateQueries({
        queryKey: ['classrooms', variables.classroomId, 'upcoming-posts'],
        refetchType: 'all',
      });

      toast.success('Post created successfully!');
    },
    onError: (error) => {
      const errorMessage = handleApiError(error);
      toast.error(`Failed to create post: ${errorMessage}`);
    },
  });
};
