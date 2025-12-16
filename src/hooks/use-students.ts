import { GetStudentsParams } from '@/lib/api/services/student.service';
import createStudentQueryOptions from '@/queryOptions/createStudentQueryOptions';
import { useQuery } from '@tanstack/react-query';

export const useStudents = (params?: GetStudentsParams) => {
  return useQuery(createStudentQueryOptions(params));
};
