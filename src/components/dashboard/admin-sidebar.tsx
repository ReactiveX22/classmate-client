'use client';

import { Sidebar } from '@/components/ui/sidebar';
import { SidebarData } from '@/types/sidebar-types';
import {
  IconActivity,
  IconChartBar,
  IconLayoutDashboard,
  IconSettings,
  IconShieldLock,
  IconUsers,
} from '@tabler/icons-react';
import { AppSidebar } from './app-sidebar';

const adminDashboardData: SidebarData = {
  user: {
    name: 'Admin User',
    email: 'admin@classmate.com',
    image: '/avatars/admin.jpg',
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
          title: 'User Management',
          icon: IconUsers,
          open: true,
          items: [
            {
              title: 'Students',
              url: '/dashboard/users/students',
            },
            {
              title: 'Teachers',
              url: '/dashboard/users/teachers',
            },
          ],
        },
        {
          title: 'Settings',
          icon: IconSettings,
          url: '/dashboard/settings',
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
