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
            {
              title: 'Admins',
              url: '/dashboard/users/admins',
            },
          ],
        },
        {
          title: 'System',
          icon: IconSettings,
          items: [
            {
              title: 'Settings',
              url: '/dashboard/settings',
            },
            {
              title: 'Audit Logs',
              url: '/dashboard/logs',
              icon: IconActivity,
            },
            {
              title: 'Permissions',
              url: '/dashboard/permissions',
              icon: IconShieldLock,
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
  ],
};

export function AdminSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return <AppSidebar data={adminDashboardData} {...props} />;
}
