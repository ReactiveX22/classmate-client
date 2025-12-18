import {
  CreateTeacherInput,
  teacherService,
} from '@/lib/api/services/teacher.service';
import { createTeacherQueryOptions } from '@/lib/queryOptions/usersQueryOptions';
import { PaginationParams } from '@/types/pagination';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

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
