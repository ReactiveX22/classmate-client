import { StudentGradesView } from './grades/student-grades-view';
import { TeacherGradesView } from './grades/teacher-grades-view';

interface GradesTabProps {
  classroomId: string;
  isTeacher?: boolean;
}

export function GradesTab({ classroomId, isTeacher }: GradesTabProps) {
  if (isTeacher) {
    return <TeacherGradesView classroomId={classroomId} />;
  }

  return <StudentGradesView classroomId={classroomId} />;
}
