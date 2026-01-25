import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { submissionService } from '@/lib/api/services/submission.service';
import { PaginationParams } from '@/types/pagination';

export const useSubmissions = (
  classroomId: string,
  postId: string,
  params?: PaginationParams
) => {
  return useQuery({
    queryKey: ['submissions', classroomId, postId, params],
    queryFn: () =>
      submissionService.getSubmissions(classroomId, postId, {
        page: params?.page,
        limit: params?.limit,
      }),
    placeholderData: keepPreviousData,
  });
};
