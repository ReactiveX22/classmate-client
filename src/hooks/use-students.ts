import {
  CreateStudentInput,
  GetStudentsParams,
  studentService,
} from '@/lib/api/services/student.service';
import { createStudentQueryOptions } from '@/lib/queryOptions/usersQueryOptions';
import { ApiError, ErrorCode } from '@/types/errors';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toast } from 'sonner';

export function useCreateStudent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (student: CreateStudentInput) =>
      studentService.createStudent(student),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
    onError: (error: AxiosError<ApiError>) => {
      const apiError = error.response?.data;
      if (apiError?.errorCode === ErrorCode.DUPLICATE_KEY) {
        toast.error('Duplicate Student ID', {
          description:
            'A student with this ID already exists. Please use a unique ID.',
        });
      } else {
        toast.error('Creation Failed', {
          description: apiError?.message || 'An unexpected error occurred.',
        });
      }
    },
  });
}

export const useStudents = (params?: GetStudentsParams) => {
  return useQuery(createStudentQueryOptions(params));
};
