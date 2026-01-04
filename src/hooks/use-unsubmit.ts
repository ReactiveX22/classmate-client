import { useMutation, useQueryClient } from '@tanstack/react-query';
import { submissionService } from '@/lib/api/services/submission.service';
import { toast } from 'sonner';
import { handleApiError } from '@/lib/api';

export const useUnsubmit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      classroomId,
      postId,
    }: {
      classroomId: string;
      postId: string;
    }) => submissionService.unsubmit(classroomId, postId),
    onSuccess: (_, variables) => {
      // Invalidate post query to refetch embedded submission
      queryClient.invalidateQueries({
        queryKey: ['post', variables.classroomId, variables.postId],
        refetchType: 'all',
      });

      toast.success('Assignment unsubmitted successfully');
    },
    onError: (error) => {
      const errorMessage = handleApiError(error);
      toast.error(`Failed to unsubmit: ${errorMessage}`);
    },
  });
};
