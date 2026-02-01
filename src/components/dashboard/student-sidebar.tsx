'use client';

import {
  IconBook,
  IconLayoutDashboard,
  IconSchool,
  IconSpeakerphone,
} from '@tabler/icons-react';
import { Sidebar } from '@/components/ui/sidebar';
import { AppSidebar } from './app-sidebar';
import { SidebarData } from '@/types/sidebar-types';
import { useClassrooms } from '@/hooks/use-classrooms';
import { useMemo } from 'react';

export function StudentSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { data: classroomsResponse, isLoading } = useClassrooms({
    limit: 50,
  });

  const studentDashboardData: SidebarData = useMemo(() => {
    const classroomItems =
      classroomsResponse?.data?.map((item) => ({
        title: item.classroom.name,
        url: `/dashboard/classrooms/${item.classroom.id}`,
      })) || [];

    const myClassesItems = [
      {
        title: 'All Classes',
        url: '/dashboard/classrooms',
      },
      ...classroomItems,
    ];

    return {
      user: {
        name: 'Student', // Ideally fetched from user context if AppSidebar doesn't handle it
        email: 'student@example.com',
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

  return <AppSidebar data={studentDashboardData} {...props} />;
}
