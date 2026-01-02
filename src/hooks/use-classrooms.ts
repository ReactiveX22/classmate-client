import {
  CreateClassroomInput,
  UpdateClassroomInput,
  classroomService,
} from '@/lib/api/services/classroom.service';
import {
  createClassroomQueryOptions,
  getClassroomQueryOptions,
} from '@/lib/queryOptions/classroomQueryOptions';
import { PaginationParams } from '@/types/pagination';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toast } from 'sonner';
import { ApiError, ErrorCode } from '@/types/errors';

export const useClassrooms = (params?: PaginationParams) => {
  return useQuery(createClassroomQueryOptions(params));
};

export const useClassroom = (id: string) => {
  return useQuery(getClassroomQueryOptions(id));
};

export function useCreateClassroom() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (classroom: CreateClassroomInput) =>
      classroomService.createClassroom(classroom),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classrooms'] });
      toast.success('Classroom created successfully');
    },
    onError: (error: AxiosError<ApiError>) => {
      const apiError = error.response?.data;
      toast.error('Creation Failed', {
        description: apiError?.message || 'An unexpected error occurred.',
      });
    },
  });
}

export function useUpdateClassroom() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateClassroomInput }) =>
      classroomService.updateClassroom(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classrooms'] });
      toast.success('Classroom updated successfully');
    },
    onError: (error: AxiosError<ApiError>) => {
      const apiError = error.response?.data;
      toast.error('Update Failed', {
        description: apiError?.message || 'An unexpected error occurred.',
      });
    },
  });
}

export function useDeleteClassroom() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => classroomService.deleteClassroom(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classrooms'] });
      toast.success('Classroom deleted successfully');
    },
    onError: (error: AxiosError<ApiError>) => {
      const apiError = error.response?.data;
      toast.error('Deletion Failed', {
        description: apiError?.message || 'An unexpected error occurred.',
      });
    },
  });
}

export function useAddStudentsToClassroom() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      classroomId,
      studentIds,
    }: {
      classroomId: string;
      studentIds: string[];
    }) => classroomService.addStudentsToClassroom(classroomId, studentIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classrooms'] });
      toast.success('Students added to classroom successfully');
    },
    onError: (error: AxiosError<ApiError>) => {
      const apiError = error.response?.data;
      toast.error('Failed to Add Students', {
        description: apiError?.message || 'An unexpected error occurred.',
      });
    },
  });
}

export function useRemoveStudentsFromClassroom() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      classroomId,
      studentIds,
    }: {
      classroomId: string;
      studentIds: string[];
    }) => classroomService.removeStudentsFromClassroom(classroomId, studentIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classrooms'] });
      toast.success('Students removed from classroom');
    },
    onError: (error: AxiosError<ApiError>) => {
      const apiError = error.response?.data;
      toast.error('Failed to Remove Students', {
        description: apiError?.message || 'An unexpected error occurred.',
      });
    },
  });
}

export function useJoinClassroom() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (classCode: string) =>
      classroomService.joinClassroom(classCode),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classrooms'] });
      toast.success('Joined classroom successfully');
    },
    onError: (error: AxiosError<ApiError>) => {
      const apiError = error.response?.data;

      if (apiError?.errorCode === ErrorCode.DUPLICATE_KEY) {
        toast.info('Already a Member', {
          description: 'You are already a member of this classroom.',
        });
        return;
      }

      toast.error('Failed to Join Classroom', {
        description: apiError?.message || 'An unexpected error occurred.',
      });
    },
  });
}
