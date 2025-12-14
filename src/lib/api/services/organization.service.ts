import type { Organization } from '@/types/auth';
import apiClient from '../index';
import { AppError } from '@/utils/errors';
import { ErrorCode } from '@/types/errors';

export const orgService = {
  async getOrgById(id: string): Promise<Organization> {
    try {
      const response = await apiClient.get<Organization>(
        `/api/v1/organizations/${id}`
      );
      console.log(response.data);
      return response.data;
    } catch (error) {
      const axiosError = error as any;

      const errorData = axiosError?.response?.data;
      const status = axiosError?.response?.status;

      if (errorData?.errorCode) {
        throw new AppError(
          errorData.errorCode as ErrorCode,
          errorData.message || 'An error occurred',
          status,
          errorData.details
        );
      }

      throw error;
    }
  },
};
