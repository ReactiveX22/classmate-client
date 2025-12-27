import { useMemo } from 'react';
import {
  IconMessageCircle,
  IconUsers,
  IconSettings,
} from '@tabler/icons-react';
import { Book, CalendarCheck, File, Star, LucideIcon } from 'lucide-react';
import { StreamTab } from '@/components/classrooms/classroom-detail/stream-tab';
import { PeopleTab } from '@/components/classrooms/classroom-detail/people-tab';
import { SettingsTab } from '@/components/classrooms/classroom-detail/settings-tab';
import { PlaceholderTab } from '@/components/classrooms/classroom-detail/placeholder-tab';

import {
  ClassroomDetail,
  Course,
  ClassroomMember,
} from '@/lib/api/services/classroom.service';
import { User } from '@/types/auth';

export interface TabConfig {
  value: string;
  label: string;
  icon: LucideIcon | React.ComponentType<{ size?: number; className?: string }>;
  content?: React.ReactNode;
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
  return useMemo<TabConfig[]>(() => {
    if (!classroom || !course || !teacher) return [];

    return [
      {
        value: 'stream',
        label: 'Stream',
        icon: IconMessageCircle,
        content: <StreamTab classroomId={classroom.id} />,
      },
      {
        value: 'classwork',
        label: 'Classwork',
        icon: File,
        content: (
          <PlaceholderTab
            title='Classwork'
            description='Manage assignments, quizzes, and course materials here.'
            icon={File}
          />
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
        content: (
          <PlaceholderTab
            title='Resources'
            description='Shared documents, links, and study materials for the classroom.'
            icon={Book}
          />
        ),
      },
      {
        value: 'grades',
        label: 'Grades',
        icon: Star,
        content: (
          <PlaceholderTab
            title='Grades'
            description='View and manage student grades, feedback, and performance metrics.'
            icon={Star}
          />
        ),
      },
      {
        value: 'people',
        label: 'People',
        icon: IconUsers,
        content: (
          <PeopleTab
            teacher={teacher}
            classroomMembers={classroomMembers}
            enrolledCount={enrolledCount}
            onAddStudents={onAddStudents}
          />
        ),
      },
      {
        value: 'settings',
        label: 'Settings',
        icon: IconSettings,
        content: (
          <SettingsTab
            classroom={classroom}
            course={course}
            onCopyClassCode={onCopyClassCode}
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
  ]);
}
