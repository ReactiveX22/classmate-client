"use client";

import { useUser } from "@/hooks/useAuth";
import {
  IconPresentation,
  IconSchool,
  IconUser,
  IconUserShield,
} from "@tabler/icons-react";

const ROLE_ICONS: Record<string, React.ElementType> = {
  student: IconSchool,
  instructor: IconPresentation,
  teacher: IconPresentation,
  admin: IconUserShield,
};

export function RoleBadge() {
  const { data: user } = useUser();

  const role = user?.role?.toLowerCase() ?? "member";
  const RoleIcon = ROLE_ICONS[role] ?? IconUser;

  return (
    <span className="hidden items-center gap-1.5 rounded-full border border-border bg-muted/50 px-2.5 py-1 text-xs font-medium text-muted-foreground sm:inline-flex">
      <RoleIcon className="size-3.5" />
      <span className="capitalize">{role}</span>
    </span>
  );
}