'use client';

import Logo from '@/components/common/logo';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useUser } from '@/hooks/useAuth';
import Link from 'next/link';

export function NavHeader() {
  const { data: user } = useUser();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size='lg'
          className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
          render={
            <Link href='/dashboard'>
              <Logo />
              <div className='grid gap-1 flex-1 text-left text-sm'>
                <span className='truncate font-bold text-lg leading-none'>
                  ClassMate
                </span>
                <span className='truncate text-xs capitalize'>
                  {user?.role}
                </span>
              </div>
            </Link>
          }
        />
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
