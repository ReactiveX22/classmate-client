import { queryOptions, UseQueryOptions } from '@tanstack/react-query';
import {
  courseSessionService,
  CourseSessionsResponse,
  CourseSession,
} from '../api/services/course-session.service';
import { PaginationParams } from '@/types/pagination';

export function createCourseSessionQueryOptions<
  TData = CourseSessionsResponse,
  TError = Error
>(
  params?: PaginationParams,
  options?: Omit<
    UseQueryOptions<CourseSessionsResponse, TError, TData>,
    'queryKey' | 'queryFn'
  >
) {
  return queryOptions({
    ...options,
    queryKey: ['course-sessions', params],
    queryFn: () => courseSessionService.getCourseSessions(params),
  });
}

export function getCourseSessionQueryOptions<TData = CourseSession, TError = Error>(
  id: string,
  options?: Omit<UseQueryOptions<CourseSession, TError, TData>, 'queryKey' | 'queryFn'>
) {
  return queryOptions({
    ...options,
    queryKey: ['course-sessions', id],
    queryFn: () => courseSessionService.getCourseSessionById(id),
  });
}
