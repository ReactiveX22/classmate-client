import { StudentSidebar } from '@/components/dashboard/student-sidebar';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { Button } from '@/components/ui/button';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

import { IconBell, IconSettings } from '@tabler/icons-react';
import { ProfileDropdown } from '../../../../example-admin/src/components/profile-dropdown';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <StudentSidebar />
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
  );
}
