import { useMemo } from 'react';
import { IconMessageCircle, IconUsers } from '@tabler/icons-react';
import { Book, CalendarCheck, File, Star, LucideIcon } from 'lucide-react';
import { StreamTab } from '@/components/classrooms/classroom-detail/stream-tab';
import { PeopleTab } from '@/components/classrooms/classroom-detail/people-tab';
import { PlaceholderTab } from '@/components/classrooms/classroom-detail/placeholder-tab';
import { ClassworkTab } from '@/components/classrooms/classroom-detail/classwork-tab';
import { ResourcesTab } from '@/components/classrooms/classroom-detail/resources-tab';
import { GradesTab } from '@/components/classrooms/classroom-detail/grades-tab';

import {
  ClassroomDetail,
  Course,
  ClassroomMember,
} from '@/lib/api/services/classroom.service';
import { User } from '@/types/auth';

import { useUser } from '@/hooks/useAuth';

export interface TabConfig {
  value: string;
  label: string;
  icon: LucideIcon | React.ComponentType<{ size?: number; className?: string }>;
  content?: React.ReactNode;
  hidden?: boolean;
}

interface UseClassroomTabsProps {
  classroom: ClassroomDetail | undefined;
  course: Course | undefined;
  teacher: User | undefined;
  classroomMembers: ClassroomMember[];
  enrolledCount: number;
  onAddStudents: () => void;
  onCopyClassCode: (code: string) => void;
}

export function useClassroomTabs({
  classroom,
  course,
  teacher,
  classroomMembers,
  enrolledCount,
  onAddStudents,
  onCopyClassCode,
}: UseClassroomTabsProps) {
  const { data: user } = useUser();
  const isTeacher = user?.id === classroom?.teacherId;

  return useMemo<TabConfig[]>(() => {
    if (!classroom || !course || !teacher) return [];

    return [
      {
        value: 'stream',
        label: 'Stream',
        icon: IconMessageCircle,
        content: <StreamTab classroomId={classroom.id} isTeacher={isTeacher} />,
      },
      {
        value: 'classwork',
        label: 'Classwork',
        icon: File,
        content: (
          <ClassworkTab classroomId={classroom.id} isTeacher={isTeacher} />
        ),
      },
      {
        value: 'attendance',
        label: 'Attendance',
        icon: CalendarCheck,
        content: (
          <PlaceholderTab
            title='Attendance'
            description='Track student attendance and participation for each class session.'
            icon={CalendarCheck}
          />
        ),
      },
      {
        value: 'resources',
        label: 'Resources',
        icon: Book,
        content: <ResourcesTab classroomId={classroom.id} />,
      },
      {
        value: 'grades',
        label: 'Grades',
        icon: Star,
        content: <GradesTab classroomId={classroom.id} isTeacher={isTeacher} />,
      },
      {
        value: 'people',
        label: 'People',
        icon: IconUsers,
        content: (
          <PeopleTab
            classroomId={classroom.id}
            teacher={teacher}
            classroomMembers={classroomMembers}
            enrolledCount={enrolledCount}
            onAddStudents={onAddStudents}
          />
        ),
      },
    ];
  }, [
    classroom,
    course,
    teacher,
    classroomMembers,
    enrolledCount,
    onAddStudents,
    onCopyClassCode,
    isTeacher,
  ]);
}
