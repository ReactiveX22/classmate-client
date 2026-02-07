'use client';

import { Sidebar } from '@/components/ui/sidebar';
import { SidebarData } from '@/types/sidebar-types';
import {
  Activity,
  BookOpen,
  GraduationCap,
  LayoutDashboard,
  Megaphone,
  Presentation,
  Settings,
  User,
} from 'lucide-react';
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
          icon: LayoutDashboard,
        },
        {
          title: 'Notices',
          icon: Megaphone,
          url: '/dashboard/notices',
        },
      ],
    },
    {
      title: 'Manage',
      items: [
        {
          title: 'Students',
          url: '/dashboard/users/students',
          icon: GraduationCap,
        },
        {
          title: 'Teachers',
          url: '/dashboard/users/teachers',
          icon: Presentation,
        },
        {
          title: 'Courses',
          url: '/dashboard/courses',
          icon: BookOpen,
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

export function AdminSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return <AppSidebar data={adminDashboardData} {...props} />;
}
