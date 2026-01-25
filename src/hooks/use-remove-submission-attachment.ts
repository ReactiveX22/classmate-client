import { useMutation, useQueryClient } from '@tanstack/react-query';
import { submissionService } from '@/lib/api/services/submission.service';
import { toast } from 'sonner';
import { handleApiError } from '@/lib/api';

export const useRemoveSubmissionAttachment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      classroomId,
      postId,
      attachmentId,
    }: {
      classroomId: string;
      postId: string;
      attachmentId: string;
    }) => submissionService.removeAttachment(classroomId, postId, attachmentId),
    onSuccess: (_, variables) => {
      // Invalidate post query to refetch embedded submission
      queryClient.invalidateQueries({
        queryKey: ['post', variables.classroomId, variables.postId],
        refetchType: 'all',
      });

      toast.success('Attachment removed');
    },
    onError: (error) => {
      const errorMessage = handleApiError(error);
      toast.error(`Failed to remove attachment: ${errorMessage}`);
    },
  });
};
