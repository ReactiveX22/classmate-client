import { userService } from '@/lib/api/services/user.service';
import { getUserProfileQueryOptions } from '@/lib/queryOptions/userQueryOptions';
import { UpdateProfileInput } from '@/types/user-profile';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export function useUserProfile() {
  return useQuery(getUserProfileQueryOptions());
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfileInput) => userService.updateProfile(data),
    onSuccess: (data) => {
      queryClient.setQueryData(['user-profile'], data);
      toast.success('Profile updated successfully');
    },
    onError: (error: any) => {
      toast.error('Failed to update profile', {
        description: error.message || 'An unexpected error occurred.',
      });
    },
  });
}
