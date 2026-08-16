"use client";

import { UserProfileView } from "@/components/users/user-profile-view";
import { useUser } from "@/hooks/useAuth";
import { useUserProfileById } from "@/hooks/use-user-profile";
import { useRouter } from "next/navigation";
import { use, useEffect } from "react";

interface ProfilePageProps {
  params: Promise<{ id: string }>;
}

export default function UserProfilePage({ params }: ProfilePageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { data: user } = useUser();

  const isOwnProfile = user?.id === id;

  useEffect(() => {
    if (isOwnProfile) {
      router.replace("/dashboard/profile");
    }
  }, [isOwnProfile, router]);

  const { data, isLoading, isError } = useUserProfileById(id);

  if (isOwnProfile) {
    return null;
  }

  return (
    <UserProfileView data={data} isLoading={isLoading} isError={isError} />
  );
}