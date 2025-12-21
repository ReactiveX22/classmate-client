import {
  CreateCourseInput,
  UpdateCourseInput,
  courseService,
} from '@/lib/api/services/course.service';
import { createCourseQueryOptions } from '@/lib/queryOptions/courseQueryOptions';
import { PaginationParams } from '@/types/pagination';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toast } from 'sonner';
import { ApiError } from '@/types/errors';

export const useCourses = (params?: PaginationParams) => {
  return useQuery(createCourseQueryOptions(params));
};

export function useCreateCourse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (course: CreateCourseInput) =>
      courseService.createCourse(course),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast.success('Course created successfully');
    },
    onError: (error: AxiosError<ApiError>) => {
      const apiError = error.response?.data;
      toast.error('Creation Failed', {
        description: apiError?.message || 'An unexpected error occurred.',
      });
    },
  });
}

export function useUpdateCourse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCourseInput }) =>
      courseService.updateCourse(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast.success('Course updated successfully');
    },
    onError: (error: AxiosError<ApiError>) => {
      const apiError = error.response?.data;
      toast.error('Update Failed', {
        description: apiError?.message || 'An unexpected error occurred.',
      });
    },
  });
}

export function useDeleteCourse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => courseService.deleteCourse(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast.success('Course deleted successfully');
    },
    onError: (error: AxiosError<ApiError>) => {
      const apiError = error.response?.data;
      toast.error('Deletion Failed', {
        description: apiError?.message || 'An unexpected error occurred.',
      });
    },
  });
}
