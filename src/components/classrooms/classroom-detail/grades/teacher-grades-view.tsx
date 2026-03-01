'use client';

import { useClassroom } from '@/hooks/use-classrooms';
import { IconUsers } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { StudentGradeSummary } from './student-grade-summary';
import { StudentList } from './student-list';

interface TeacherGradesViewProps {
  classroomId: string;
}

export function TeacherGradesView({ classroomId }: TeacherGradesViewProps) {
  const { data: classroom } = useClassroom(classroomId);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    null,
  );

  // Auto-select first student if none selected
  useEffect(() => {
    if (
      !selectedStudentId &&
      classroom?.classroomMembers &&
      classroom.classroomMembers.length > 0
    ) {
      setSelectedStudentId(classroom.classroomMembers[0].studentId);
    }
  }, [classroom?.classroomMembers, selectedStudentId]);

  return (
    <div className='flex flex-col md:flex-row md:items-start h-auto md:h-[calc(100vh-12rem)] border rounded-lg bg-card overflow-hidden shadow-sm mt-6'>
      <StudentList
        classroomId={classroomId}
        selectedStudentId={selectedStudentId}
        onSelectStudent={setSelectedStudentId}
      />

      {selectedStudentId ? (
        <StudentGradeSummary
          classroomId={classroomId}
          studentId={selectedStudentId}
        />
      ) : (
        <div className='flex-1 flex flex-col items-center justify-center p-8 text-center text-muted-foreground h-full bg-muted/5'>
          <div className='p-4 bg-background rounded-full mb-4'>
            <IconUsers className='w-8 h-8 opacity-50' />
          </div>
          <h3 className='font-medium text-lg'>No student selected</h3>
          <p className='text-sm max-w-xs'>
            Select a student from the list to view their grades and progress.
          </p>
        </div>
      )}
    </div>
  );
}
