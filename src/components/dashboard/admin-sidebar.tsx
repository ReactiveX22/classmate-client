'use client';

import { Sidebar } from '@/components/ui/sidebar';
import { SidebarData } from '@/types/sidebar-types';
import {
  IconActivity,
  IconBook,
  IconChalkboard,
  IconLayoutDashboard,
  IconSchool,
  IconSettings,
} from '@tabler/icons-react';
import { AppSidebar } from './app-sidebar';

const adminDashboardData: SidebarData = {
  user: {
    name: 'Admin User',
    email: 'admin@classmate.com',
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
          title: 'Settings',
          icon: IconSettings,
          url: '/dashboard/settings',
        },
      ],
    },
    {
      title: 'Manage',
      items: [
        {
          title: 'Students',
          url: '/dashboard/users/students',
          icon: IconSchool,
        },
        {
          title: 'Teachers',
          url: '/dashboard/users/teachers',
          icon: IconChalkboard,
        },
        {
          title: 'Courses',
          url: '/dashboard/courses',
          icon: IconBook,
        },
      ],
    },
  ],
};

export function AdminSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return <AppSidebar data={adminDashboardData} {...props} />;
}
