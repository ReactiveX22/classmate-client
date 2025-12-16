import {
  CreateTeacherInput,
  teacherService,
} from '@/lib/api/services/teacher.service';
import { useMutation } from '@tanstack/react-query';

export function useCreateTeacher() {
  return useMutation({
    mutationFn: (user: CreateTeacherInput) =>
      teacherService.createTeacher(user),
  });
}
