'use client';

import { StudentSidebar } from '@/components/dashboard/student-sidebar';
import { TeacherSidebar } from '@/components/dashboard/teacher-sidebar';
import { AdminSidebar } from '@/components/dashboard/admin-sidebar';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { Button } from '@/components/ui/button';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

import { IconBell, IconSettings } from '@tabler/icons-react';
import { ProfileDropdown } from '@/components/dashboard/profile-dropdown';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useUser } from '@/hooks/useAuth';

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
      case 'org-admin':
        return <AdminSidebar />;
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
            <Button variant='ghost' size='icon'>
              <IconBell size={20} />
            </Button>
            <Button variant='ghost' size='icon'>
              <IconSettings size={20} />
            </Button>
            <ProfileDropdown />
          </DashboardHeader>
          <div className='flex flex-1 flex-col gap-4 p-4 pt-0'>
            <div className='mt-4'>{children}</div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
