import { useQuery } from '@tanstack/react-query';
import { submissionService } from '@/lib/api/services/submission.service';

export const useSubmission = (classroomId: string, postId: string) => {
  return useQuery({
    queryKey: ['submission', classroomId, postId],
    queryFn: () => submissionService.getMySubmission(classroomId, postId),
    enabled: !!classroomId && !!postId,
  });
};
