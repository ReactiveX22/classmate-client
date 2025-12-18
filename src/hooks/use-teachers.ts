import {
  CreateTeacherInput,
  teacherService,
} from '@/lib/api/services/teacher.service';
import { createTeacherQueryOptions } from '@/lib/queryOptions/usersQueryOptions';
import { PaginationParams } from '@/types/pagination';
import { useMutation, useQuery } from '@tanstack/react-query';

export function useCreateTeacher() {
  return useMutation({
    mutationFn: (user: CreateTeacherInput) =>
      teacherService.createTeacher(user),
  });
}

export function useTeachers(params?: PaginationParams) {
  return useQuery(createTeacherQueryOptions(params));
}
