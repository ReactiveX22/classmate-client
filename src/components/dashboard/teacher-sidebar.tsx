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

const teacherDashboardData: SidebarData = {
  user: {
    name: 'Teacher Name',
    email: 'teacher@example.com',
    avatar: '/avatars/teacher.jpg',
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
          items: [
            {
              title: 'Mathematics 101',
              url: '/dashboard/classes/math101',
            },
            {
              title: 'Physics 202',
              url: '/dashboard/classes/physics202',
            },
          ],
        },
        {
          title: 'Students',
          url: '/dashboard/students',
          icon: IconUsers,
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

export function TeacherSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return <AppSidebar data={teacherDashboardData} {...props} />;
}
