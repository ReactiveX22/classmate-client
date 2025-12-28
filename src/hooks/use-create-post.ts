import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postService, CreatePostDto } from '@/lib/api/services/post.service';
import { toast } from 'sonner';
import { handleApiError } from '@/lib/api';

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePostDto) => postService.createPost(data),
    onSuccess: (newPost) => {
      // Invalidate posts query to refetch
      queryClient.invalidateQueries({
        queryKey: ['posts', newPost.classroomId],
      });

      toast.success('Post created successfully!');
    },
    onError: (error) => {
      const errorMessage = handleApiError(error);
      toast.error(`Failed to create post: ${errorMessage}`);
    },
  });
};
