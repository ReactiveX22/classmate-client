'use client';

import { Sidebar } from '@/components/ui/sidebar';
import { useAiConversationsForClassrooms } from '@/hooks/use-ai-conversations-for-classrooms';
import { useClassrooms } from '@/hooks/use-classrooms';
import { SidebarData } from '@/types/sidebar-types';
import {
  BookOpenIcon,
  Bot,
  LayoutDashboard,
  Megaphone,
  Settings,
  User,
} from 'lucide-react';
import { useMemo } from 'react';
import { AppSidebar } from './app-sidebar';

export function TeacherSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { data: classroomsResponse, isLoading } = useClassrooms({
    limit: 50, // Get all teacher's classrooms
  });
  const classroomIds =
    classroomsResponse?.data?.map((item) => item.classroom.id) ?? [];
  const { conversations, isLoading: isConversationsLoading } =
    useAiConversationsForClassrooms(classroomIds);

  const teacherDashboardData: SidebarData = useMemo(() => {
    // Build classroom items dynamically
    const classroomItems =
      classroomsResponse?.data?.map((item) => ({
        title: item.classroom.name,
        url: `/dashboard/classrooms/${item.classroom.id}`,
      })) || [];

    const conversationItems = conversations.map((conversation) => ({
      title: conversation.title || 'Untitled chat',
      url: `/dashboard/ai/${conversation.id}`,
    }));

    const conversationsNavItems =
      conversationItems.length > 0
        ? [
            {
              title: 'New Chat',
              url: '/dashboard/ai',
            },
            ...conversationItems,
          ]
        : [
            {
              title: isConversationsLoading ? 'Loading...' : 'No chats yet',
              url: '/dashboard/ai',
            },
          ];

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
              icon: LayoutDashboard,
            },
            {
              title: 'My Classes',
              icon: BookOpenIcon,
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
          title: 'AI Chats',
          items: [
            {
              title: 'Conversations',
              icon: Bot,
              items: conversationsNavItems,
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
  }, [classroomsResponse, conversations, isLoading, isConversationsLoading]);

  return <AppSidebar data={teacherDashboardData} {...props} />;
}
