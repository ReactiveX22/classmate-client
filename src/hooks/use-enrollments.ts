import {
  CreateEnrollmentInput,
  enrollmentService,
} from '@/lib/api/services/enrollment.service';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toast } from 'sonner';
import { ApiError } from '@/types/errors';

export function useCreateEnrollment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateEnrollmentInput) =>
      enrollmentService.createEnrollment(payload),
    onSuccess: (_, { courseId }) => {
      queryClient.invalidateQueries({ queryKey: ['courses', courseId] });
      toast.success('Student enrolled successfully');
    },
    onError: (error: AxiosError<ApiError>) => {
      const apiError = error.response?.data;
      toast.error('Enrollment Failed', {
        description: apiError?.message || 'An unexpected error occurred.',
      });
    },
  });
}
