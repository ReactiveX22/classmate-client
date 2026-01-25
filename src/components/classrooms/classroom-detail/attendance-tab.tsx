'use client';

import { TeacherAttendanceView } from './teacher-attendance-view';
import { StudentAttendanceView } from './student-attendance-view';
import { useUser } from '@/hooks/useAuth';

interface AttendanceTabProps {
  classroomId: string;
  isTeacher?: boolean;
}

export function AttendanceTab({
  classroomId,
  isTeacher = false,
}: AttendanceTabProps) {
  const { data: user } = useUser();

  if (isTeacher) {
    return (
      <TeacherAttendanceView classroomId={classroomId} isTeacher={isTeacher} />
    );
  }

  return (
    <StudentAttendanceView classroomId={classroomId} studentId={user?.id} />
  );
}
