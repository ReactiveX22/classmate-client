import { queryOptions, UseQueryOptions } from '@tanstack/react-query';
import {
  classroomService,
  ClassroomsResponse,
  ClassroomDetail,
  AttendanceChecklistItem,
  UpcomingPost,
} from '../api/services/classroom.service';
import { PaginationParams } from '@/types/pagination';

export function createClassroomQueryOptions<
  TData = ClassroomsResponse,
  TError = Error,
>(
  params?: PaginationParams,
  options?: Omit<
    UseQueryOptions<ClassroomsResponse, TError, TData>,
    'queryKey' | 'queryFn'
  >,
) {
  return queryOptions({
    ...options,
    queryKey: ['classrooms', params],
    queryFn: () => classroomService.getClassrooms(params),
  });
}

export function getClassroomQueryOptions<
  TData = ClassroomDetail,
  TError = Error,
>(
  id: string,
  options?: Omit<
    UseQueryOptions<ClassroomDetail, TError, TData>,
    'queryKey' | 'queryFn'
  >,
) {
  return queryOptions({
    ...options,
    queryKey: ['classrooms', id],
    queryFn: () => classroomService.getClassroomById(id),
  });
}
export function getAttendanceChecklistQueryOptions<
  TData = AttendanceChecklistItem[],
  TError = Error,
>(
  classroomId: string,
  date?: string,
  options?: Omit<
    UseQueryOptions<AttendanceChecklistItem[], TError, TData>,
    'queryKey' | 'queryFn'
  >,
) {
  return queryOptions({
    ...options,
    queryKey: ['classrooms', classroomId, 'attendance-checklist', date],
    queryFn: () => classroomService.getAttendanceChecklist(classroomId, date),
  });
}

export function getStudentAttendanceStatsQueryOptions<
  TData = any, // Using any for TData to allow for flexibility, but could be StudentAttendanceStats
  TError = Error,
>(
  classroomId: string,
  studentId: string,
  options?: Omit<UseQueryOptions<any, TError, TData>, 'queryKey' | 'queryFn'>,
) {
  return queryOptions({
    ...options,
    queryKey: ['classrooms', classroomId, 'attendance-stats', studentId],
    queryFn: () =>
      classroomService.getStudentAttendanceStats(classroomId, studentId),
  });
}
export function getUpcomingPostsQueryOptions<
  TData = UpcomingPost[],
  TError = Error,
>(
  classroomId: string,
  options?: Omit<
    UseQueryOptions<UpcomingPost[], TError, TData>,
    'queryKey' | 'queryFn'
  >,
) {
  return queryOptions({
    ...options,
    queryKey: ['classrooms', classroomId, 'upcoming-posts'],
    queryFn: () => classroomService.getUpcomingPosts(classroomId),
  });
}
