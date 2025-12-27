'use client';

import {
  IconBook,
  IconBuildingBank,
  IconCalendar,
  IconClipboardList,
  IconLayoutDashboard,
  IconLifebuoy,
  IconSpeakerphone,
  IconUserCircle,
} from '@tabler/icons-react';
import { Sidebar } from '@/components/ui/sidebar';
import { AppSidebar } from './app-sidebar';
import { SidebarData } from '@/types/sidebar-types';

const studentDashboardData: SidebarData = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
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
          title: 'Courses',
          icon: IconBook,
          items: [
            {
              title: 'Mathematics',
              url: '/dashboard/courses/math',
            },
            {
              title: 'Physics',
              url: '/dashboard/courses/physics',
            },
            {
              title: 'History',
              url: '/dashboard/courses/history',
            },
          ],
        },
        {
          title: 'Assignments',
          icon: IconClipboardList,
          items: [
            {
              title: 'Pending',
              url: '/dashboard/assignments/pending',
            },
            {
              title: 'Completed',
              url: '/dashboard/assignments/completed',
            },
            {
              title: 'Grades',
              url: '/dashboard/assignments/grades',
            },
          ],
        },
        {
          title: 'Notices',
          icon: IconSpeakerphone,
          items: [
            {
              title: 'Official',
              url: '/dashboard/notices/official',
            },
            {
              title: 'Department',
              url: '/dashboard/notices/dept',
            },
            {
              title: 'Events',
              url: '/dashboard/notices/events',
            },
          ],
        },
        {
          title: 'Profile',
          url: '/dashboard/profile',
          icon: IconUserCircle,
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

export function StudentSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return <AppSidebar data={studentDashboardData} {...props} />;
}
