import api from '@/lib/api';
import { UpdateProfileInput, UserProfileResponse } from '@/types/user-profile';

export const userService = {
  getProfile: async () => {
    const { data } = await api.get<UserProfileResponse>('/api/v1/users/me');
    return data;
  },

  updateProfile: async (data: UpdateProfileInput) => {
    let payload: any = data;

    if (data.image instanceof File) {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined) {
          if (Array.isArray(value)) {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, value as string | Blob);
          }
        }
      });
      payload = formData;
    }

    const response = await api.patch<UserProfileResponse>(
      '/api/v1/users/me',
      payload,
      {
        headers:
          payload instanceof FormData
            ? { 'Content-Type': 'multipart/form-data' }
            : undefined,
      },
    );
    return response.data;
  },
};
