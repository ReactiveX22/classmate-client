import {
  GetStudentsParams,
  studentService,
  StudentsResponse,
} from '@/lib/api/services/student.service';
import { PaginationParams } from '@/types/pagination';
import { queryOptions, UseQueryOptions } from '@tanstack/react-query';
import {
  teacherService,
  TeachersResponse,
} from '../api/services/teacher.service';

export function createStudentQueryOptions<
  TData = StudentsResponse,
  TError = Error
>(
  params?: GetStudentsParams,
  options?: Omit<
    UseQueryOptions<StudentsResponse, TError, TData>,
    'queryKey' | 'queryFn'
  >
) {
  return queryOptions({
    ...options,
    queryKey: ['students', params],
    queryFn: () => studentService.getStudents(params),
  });
}

export function createTeacherQueryOptions<
  TData = TeachersResponse,
  TError = Error
>(
  params?: PaginationParams,
  options?: Omit<
    UseQueryOptions<TeachersResponse, TError, TData>,
    'queryKey' | 'queryFn'
  >
) {
  return queryOptions({
    ...options,
    queryKey: ['teachers', params],
    queryFn: () => teacherService.getTeachers(params),
  });
}
