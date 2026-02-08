import { userService } from '@/lib/api/services/user.service';
import { queryOptions } from '@tanstack/react-query';

export const getUserProfileQueryOptions = () => {
  return queryOptions({
    queryKey: ['user-profile'],
    queryFn: () => userService.getProfile(),
    staleTime: 5 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};
