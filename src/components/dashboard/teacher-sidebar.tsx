'use client';

import {
  IconBook,
  IconBuildingBank,
  IconCalendar,
  IconChartBar,
  IconClipboardList,
  IconLayoutDashboard,
  IconLifebuoy,
  IconSchool,
  IconUsers,
} from '@tabler/icons-react';
import { AppSidebar } from './app-sidebar';
import { SidebarData } from '@/types/sidebar-types';
import { Sidebar } from '@/components/ui/sidebar';
import { useClassrooms } from '@/hooks/use-classrooms';
import { useMemo } from 'react';

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
              open: true,
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
              title: 'Assignments',
              icon: IconClipboardList,
              items: [
                {
                  title: 'Create New',
                  url: '/dashboard/assignments/new',
                },
                {
                  title: 'Review',
                  url: '/dashboard/assignments/review',
                },
              ],
            },
            {
              title: 'Reports',
              url: '/dashboard/reports',
              icon: IconChartBar,
            },
          ],
        },
        {
          title: 'Quick Access',
          items: [
            {
              title: 'Calendar',
              url: '/dashboard/calendar',
              icon: IconCalendar,
            },
            {
              title: 'Library',
              url: '/dashboard/library',
              icon: IconBuildingBank,
            },
            {
              title: 'Support',
              url: '/dashboard/support',
              icon: IconLifebuoy,
            },
          ],
        },
      ],
    };
  }, [classroomsResponse, isLoading]);

  return <AppSidebar data={teacherDashboardData} {...props} />;
}
