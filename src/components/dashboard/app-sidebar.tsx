import * as React from 'react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';
import { NavHeader } from './nav-header';
import { NavUser } from './nav-user';
import { SidebarData } from '@/types/sidebar-types';
import { NavGroup } from './nav-group';

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  data: SidebarData;
}

export function AppSidebar({ data, ...props }: AppSidebarProps) {
  return (
    <Sidebar collapsible='icon' {...props}>
      <SidebarHeader>
        <NavHeader />
      </SidebarHeader>
      <SidebarContent>
        {data.navGroups.map((props) => (
          <NavGroup key={props.title} {...props} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
