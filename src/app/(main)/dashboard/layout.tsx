'use client';

import { AdminSidebar } from '@/components/dashboard/admin-sidebar';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { NotificationPopover } from '@/components/dashboard/notification-popover';
import { StudentSidebar } from '@/components/dashboard/student-sidebar';
import { TeacherSidebar } from '@/components/dashboard/teacher-sidebar';
import { Button } from '@/components/ui/button';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { ProfileDropdown } from '@/components/dashboard/profile-dropdown';
import { useUser } from '@/hooks/useAuth';
import { IconSettings } from '@tabler/icons-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: user } = useUser();

  const getSidebar = () => {
    switch (user?.role) {
      case 'instructor':
        return <TeacherSidebar />;
      case 'admin':
        return <AdminSidebar />;
      case 'student':
      default:
        return <StudentSidebar />;
    }
  };

  return (
    <ProtectedRoute>
      <SidebarProvider>
        {getSidebar()}
        <SidebarInset>
          <DashboardHeader title='Dashboard'>
            <NotificationPopover />
            <Button variant='ghost' size='icon'>
              <IconSettings size={20} />
            </Button>
            <ProfileDropdown />
          </DashboardHeader>
          <div className='flex flex-1 flex-col gap-4'>{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
