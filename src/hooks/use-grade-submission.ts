import { useMutation, useQueryClient } from '@tanstack/react-query';
import { submissionService } from '@/lib/api/services/submission.service';
import { toast } from 'sonner';

export const useGradeSubmission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      classroomId,
      postId,
      submissionId,
      grade,
    }: {
      classroomId: string;
      postId: string;
      submissionId: string;
      grade: number;
    }) =>
      submissionService.gradeSubmission(
        classroomId,
        postId,
        submissionId,
        grade
      ),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['submissions', variables.classroomId, variables.postId],
      });
      toast.success('Grade updated successfully');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to update grade');
    },
  });
};
