import { queryOptions, UseQueryOptions } from '@tanstack/react-query';
import {
  semesterService,
  SemestersResponse,
  Semester,
} from '../api/services/semester.service';
import { PaginationParams } from '@/types/pagination';

export function createSemesterQueryOptions<
  TData = SemestersResponse,
  TError = Error
>(
  params?: PaginationParams,
  options?: Omit<
    UseQueryOptions<SemestersResponse, TError, TData>,
    'queryKey' | 'queryFn'
  >
) {
  return queryOptions({
    ...options,
    queryKey: ['semesters', params],
    queryFn: () => semesterService.getSemesters(params),
  });
}

export function getSemesterQueryOptions<TData = Semester, TError = Error>(
  id: string,
  options?: Omit<UseQueryOptions<Semester, TError, TData>, 'queryKey' | 'queryFn'>
) {
  return queryOptions({
    ...options,
    queryKey: ['semesters', id],
    queryFn: () => semesterService.getSemesterById(id),
  });
}
