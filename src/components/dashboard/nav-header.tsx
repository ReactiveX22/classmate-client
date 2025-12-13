'use client';

import * as React from 'react';

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import Logo from '@/components/common/logo';
import Link from 'next/link';

export function NavHeader() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size='lg'
          className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
          render={
            <Link href='/dashboard'>
              <Logo />
              <div className='grid flex-1 text-left text-sm leading-tight'>
                <span className='truncate font-bold text-lg'>ClassMate</span>
                <span className='truncate text-xs'>Student</span>
              </div>
            </Link>
          }
        />
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
