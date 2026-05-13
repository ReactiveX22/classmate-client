import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { SidebarData } from "@/types/sidebar-types";
import { NavGroup } from "./nav-group";
import { NavHeader } from "./nav-header";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  data: SidebarData;
}

export function AppSidebar({ data, ...props }: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon" variant="floating" {...props}>
      <SidebarHeader>
        <NavHeader />
      </SidebarHeader>
      <SidebarContent>
        {data.navGroups.map((props) => (
          <NavGroup key={props.title} {...props} />
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
