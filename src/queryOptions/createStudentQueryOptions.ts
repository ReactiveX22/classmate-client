import {
  GetStudentsParams,
  studentService,
  StudentsResponse,
} from '@/lib/api/services/student.service';
import { queryOptions, UseQueryOptions } from '@tanstack/react-query';

export default function createStudentQueryOptions<
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
