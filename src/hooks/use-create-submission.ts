import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  submissionService,
  CreateSubmissionDto,
} from '@/lib/api/services/submission.service';
import { toast } from 'sonner';
import { handleApiError } from '@/lib/api';

export const useCreateSubmission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      classroomId,
      postId,
      data,
    }: {
      classroomId: string;
      postId: string;
      data: CreateSubmissionDto;
    }) => submissionService.createSubmission(classroomId, postId, data),
    onSuccess: (_, variables) => {
      // Invalidate submission query to refetch
      queryClient.invalidateQueries({
        queryKey: ['submission', variables.classroomId, variables.postId],
        refetchType: 'all',
      });

      toast.success('Assignment submitted successfully!');
    },
    onError: (error) => {
      const errorMessage = handleApiError(error);
      toast.error(`Failed to submit assignment: ${errorMessage}`);
    },
  });
};
