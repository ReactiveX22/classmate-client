"use client";

import { RoleGuard } from "@/components/common/role-guard";
import { UserProfileView } from "@/components/users/user-profile-view";
import { useUserProfileById } from "@/hooks/use-user-profile";
import { Role } from "@/types/auth";
import { use } from "react";

interface AdminUserViewPageProps {
  params: Promise<{ id: string }>;
}

export default function AdminUserViewPage({ params }: AdminUserViewPageProps) {
  const { id } = use(params);
  const { data, isLoading, isError } = useUserProfileById(id);

  return (
    <RoleGuard allowedRoles={[Role.Admin]}>
      <UserProfileView data={data} isLoading={isLoading} isError={isError} />
    </RoleGuard>
  );
}