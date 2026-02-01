'use client';

import { Sidebar } from '@/components/ui/sidebar';
import { useClassrooms } from '@/hooks/use-classrooms';
import { SidebarData } from '@/types/sidebar-types';
import {
  IconLayoutDashboard,
  IconMicrophone,
  IconSchool,
  IconSpeakerphone,
} from '@tabler/icons-react';
import { useMemo } from 'react';
import { AppSidebar } from './app-sidebar';

export function TeacherSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { data: classroomsResponse, isLoading } = useClassrooms({
    limit: 50, // Get all teacher's classrooms
  });

  const teacherDashboardData: SidebarData = useMemo(() => {
    // Build classroom items dynamically
    const classroomItems =
      classroomsResponse?.data?.map((item) => ({
        title: item.classroom.name,
        url: `/dashboard/classrooms/${item.classroom.id}`,
      })) || [];

    // Add "All Classes" item at the top
    const myClassesItems = [
      {
        title: 'All Classes',
        url: '/dashboard/classrooms',
      },
      ...classroomItems,
    ];

    return {
      user: {
        name: 'Teacher Name',
        email: 'teacher@example.com',
        image: '',
      },
      navGroups: [
        {
          title: 'General',
          items: [
            {
              title: 'Dashboard',
              url: '/dashboard',
              icon: IconLayoutDashboard,
            },
            {
              title: 'My Classes',
              icon: IconSchool,
              items:
                classroomItems.length > 0
                  ? myClassesItems
                  : [
                      {
                        title: isLoading ? 'Loading...' : 'No classes yet',
                        url: '/dashboard/classrooms',
                      },
                    ],
            },
            {
              title: 'Notices',
              url: '/dashboard/notices',
              icon: IconSpeakerphone,
            },
          ],
        },
      ],
    };
  }, [classroomsResponse, isLoading]);

  return <AppSidebar data={teacherDashboardData} {...props} />;
}
