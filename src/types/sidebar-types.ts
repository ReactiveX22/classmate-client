import { LucideIcon } from 'lucide-react';
import { User } from './auth';

export type BaseNavItem = {
  title: string;
  badge?: string;
  icon?: LucideIcon | React.ElementType;
};

export type NavLink = BaseNavItem & {
  url: string;
  items?: never;
};

export type NavCollapsible = BaseNavItem & {
  items: (BaseNavItem & { url: string })[];
  url?: never;
  open?: boolean;
};

export type NavItem = NavCollapsible | NavLink;

export type NavGroup = {
  title: string;
  items: NavItem[];
};

export type SidebarData = {
  user: SidebarUser;
  navGroups: NavGroup[];
};

interface SidebarUser {
  name: string;
  email: string;
  image?: string;
}
