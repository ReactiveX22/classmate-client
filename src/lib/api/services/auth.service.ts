import apiClient, { handleApiError } from '../index';
import { authClient } from '@/lib/auth-client';
import type { LoginCredentials, SignupCredentials, User } from '@/types/auth';

export const authService = {
  async login(credentials: LoginCredentials) {
    const response = await authClient.signIn.email({
      email: credentials.email,
      password: credentials.password,
    });

    if (response.error) {
      throw new Error(response.error.message || 'Login failed');
    }

    if (!response.data) {
      throw new Error('Login failed - no data returned');
    }

    return response.data;
  },

  async signup(credentials: SignupCredentials) {
    const response = await authClient.signUp.email({
      email: credentials.email,
      password: credentials.password,
      name: credentials.name,
      organizationName: credentials.organizationName,
    } as Parameters<typeof authClient.signUp.email>[0]);

    if (response.error) {
      throw new Error(response.error.message || 'Signup failed');
    }

    if (!response.data) {
      throw new Error('Signup failed - no data returned');
    }

    return response.data;
  },

  async logout() {
    try {
      await authClient.signOut();
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
};
