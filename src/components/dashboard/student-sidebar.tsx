'use client';

import {
  BookOpen,
  LayoutDashboard,
  Megaphone,
  School,
  Settings,
  User,
} from 'lucide-react';
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
              icon: LayoutDashboard,
            },
            {
              title: 'My Classes',
              icon: School,
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
              icon: Megaphone,
            },
          ],
        },
        {
          title: 'Account',
          items: [
            {
              title: 'Profile',
              url: '/dashboard/profile',
              icon: User,
            },
            {
              title: 'Settings',
              url: '/dashboard/settings',
              icon: Settings,
            },
          ],
        },
      ],
    };
  }, [classroomsResponse, isLoading]);

  return <AppSidebar data={studentDashboardData} {...props} />;
}
