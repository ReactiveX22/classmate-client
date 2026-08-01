import { userService } from "@/lib/api/services/user.service";
import {
  getUserProfileByIdQueryOptions,
  getUserProfileQueryOptions,
} from "@/lib/queryOptions/userQueryOptions";
import { UpdateProfileInput } from "@/types/user-profile";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { handleApiError } from "@/lib/api";

export function useUserProfile() {
  return useQuery(getUserProfileQueryOptions());
}

export function useUserProfileById(id: string) {
  return useQuery(getUserProfileByIdQueryOptions(id));
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfileInput) => userService.updateProfile(data),
    onSuccess: (data) => {
      queryClient.setQueryData(["user-profile"], data);
      toast.success("Profile updated successfully");
    },
    onError: (error: unknown) => {
      toast.error("Failed to update profile", {
        description: handleApiError(error),
      });
    },
  });
}
