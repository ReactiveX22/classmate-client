import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  classroomService,
  BulkCreateAttendanceInput,
} from '@/lib/api/services/classroom.service';
import { toast } from 'sonner';
import { handleApiError } from '@/lib/api';

export const useBulkCreateAttendance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      classroomId,
      data,
    }: {
      classroomId: string;
      data: BulkCreateAttendanceInput;
    }) => classroomService.bulkCreateAttendance(classroomId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [
          'classrooms',
          variables.classroomId,
          'attendance-checklist',
          variables.data.date,
        ],
      });
      toast.success('Attendance saved successfully!');
    },
    onError: (error) => {
      const errorMessage = handleApiError(error);
      toast.error(`Failed to save attendance: ${errorMessage}`);
    },
  });
};
