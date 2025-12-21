import { queryOptions, UseQueryOptions } from '@tanstack/react-query';
import {
  courseService,
  CoursesResponse,
  Course,
} from '../api/services/course.service';
import { PaginationParams } from '@/types/pagination';

export function createCourseQueryOptions<
  TData = CoursesResponse,
  TError = Error
>(
  params?: PaginationParams,
  options?: Omit<
    UseQueryOptions<CoursesResponse, TError, TData>,
    'queryKey' | 'queryFn'
  >
) {
  return queryOptions({
    ...options,
    queryKey: ['courses', params],
    queryFn: () => courseService.getCourses(params),
  });
}

export function getCourseQueryOptions<TData = Course, TError = Error>(
  id: string,
  options?: Omit<UseQueryOptions<Course, TError, TData>, 'queryKey' | 'queryFn'>
) {
  return queryOptions({
    ...options,
    queryKey: ['courses', id],
    queryFn: () => courseService.getCourseById(id),
  });
}
