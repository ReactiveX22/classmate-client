import { queryOptions, UseQueryOptions } from '@tanstack/react-query';
import {
  classroomService,
  ClassroomsResponse,
  ClassroomWithCourse,
} from '../api/services/classroom.service';
import { PaginationParams } from '@/types/pagination';

export function createClassroomQueryOptions<
  TData = ClassroomsResponse,
  TError = Error
>(
  params?: PaginationParams,
  options?: Omit<
    UseQueryOptions<ClassroomsResponse, TError, TData>,
    'queryKey' | 'queryFn'
  >
) {
  return queryOptions({
    ...options,
    queryKey: ['classrooms', params],
    queryFn: () => classroomService.getClassrooms(params),
  });
}

export function getClassroomQueryOptions<
  TData = ClassroomWithCourse,
  TError = Error
>(
  id: string,
  options?: Omit<
    UseQueryOptions<ClassroomWithCourse, TError, TData>,
    'queryKey' | 'queryFn'
  >
) {
  return queryOptions({
    ...options,
    queryKey: ['classrooms', id],
    queryFn: () => classroomService.getClassroomById(id),
  });
}
