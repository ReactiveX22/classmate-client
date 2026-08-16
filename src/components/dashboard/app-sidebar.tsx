import * as React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { SidebarData } from "@/types/sidebar-types";
import { ChevronsUpDown, User } from "lucide-react";
import { NavGroup } from "./nav-group";
import { NavHeader } from "./nav-header";
import { ProfileDropdown } from "./profile-dropdown";

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
        <ProfileDropdown
          side="right"
          trigger={(user) => (
            <SidebarMenuButton
              size="lg"
              className="py-2 data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.image || ""} alt={user.name} />
                <AvatarFallback>
                  <User className="size-4" />
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold text-sidebar-foreground">
                  {user.name}
                </span>
                <span className="truncate text-xs text-sidebar-foreground/60">
                  {user.email}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-4 text-sidebar-foreground/60" />
            </SidebarMenuButton>
          )}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
