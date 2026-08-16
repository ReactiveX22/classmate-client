import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { SidebarData } from "@/types/sidebar-types";
import { NavGroup } from "./nav-group";
import { NavHeader } from "./nav-header";
import { NavUser } from "./nav-user";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  data: SidebarData;
}

export function AppSidebar({ data, ...props }: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="flex h-14 shrink-0 items-center border-b border-sidebar-border/70 px-2">
        <NavHeader />
      </SidebarHeader>
      <SidebarContent className="gap-0">
        {data.navGroups.map((props, index) => (
          <NavGroup
            key={props.title}
            {...props}
            className={index === 0 ? "pt-5" : "pt-6"}
          />
        ))}
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border/70 px-2 pt-2 pb-4">
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
