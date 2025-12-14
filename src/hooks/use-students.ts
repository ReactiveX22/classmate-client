import { useQuery } from '@tanstack/react-query';
import { studentService } from '@/lib/api/services/student.service';

export const studentKeys = {
  all: ['students'] as const,
  lists: () => [...studentKeys.all, 'list'] as const,
  list: (params?: any) => [...studentKeys.lists(), { ...params }] as const,
};

export const useStudents = (params?: any) => {
  return useQuery({
    queryKey: studentKeys.list(params),
    queryFn: () => studentService.getStudents(params),
  });
};
