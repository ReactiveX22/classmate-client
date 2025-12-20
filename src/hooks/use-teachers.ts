import {
  CreateTeacherInput,
  teacherService,
} from '@/lib/api/services/teacher.service';
import { createTeacherQueryOptions } from '@/lib/queryOptions/usersQueryOptions';
import { ApiError, ErrorCode } from '@/types/errors';
import { PaginationParams } from '@/types/pagination';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toast } from 'sonner';

export function useCreateTeacher() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (user: CreateTeacherInput) =>
      teacherService.createTeacher(user),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
    },
  });
}

export function useTeachers(params?: PaginationParams) {
  return useQuery(createTeacherQueryOptions(params));
}

export function useDeleteTeacher() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => teacherService.deleteTeacher(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
    },
    onError: (error: AxiosError<ApiError>) => {
      const apiError = error.response?.data;
      if (apiError?.errorCode === ErrorCode.RESOURCE_NOT_FOUND) {
        toast.error('Teacher Not Found', {
          description: 'The teacher you are trying to delete does not exist.',
        });
      } else {
        toast.error('Deletion Failed', {
          description: apiError?.message || 'An unexpected error occurred.',
        });
      }
    },
  });
}
export function useUpdateTeacher() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      teacherService.updateTeacher(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
      toast.success('Teacher updated successfully');
    },
    onError: (error: AxiosError<ApiError>) => {
      const apiError = error.response?.data;
      toast.error('Update Failed', {
        description: apiError?.message || 'An unexpected error occurred.',
      });
    },
  });
}
