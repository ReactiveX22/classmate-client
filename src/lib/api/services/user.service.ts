import api from '@/lib/api';
import { UpdateProfileInput, UserProfileResponse } from '@/types/user-profile';

export const userService = {
  getProfile: async () => {
    const { data } = await api.get<UserProfileResponse>('/api/v1/users/me');
    return data;
  },

  updateProfile: async (data: UpdateProfileInput) => {
    const response = await api.patch<UserProfileResponse>(
      '/api/v1/users/me',
      data,
    );
    return response.data;
  },
};
