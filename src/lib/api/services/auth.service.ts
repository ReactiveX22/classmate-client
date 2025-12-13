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
    });

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

  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await apiClient.get<{ user: User }>(
        '/api/auth/get-session'
      );
      return response.data.user;
    } catch (error) {
      console.error('Failed to get current user:', error);
      return null;
    }
  },

  async isAuthenticated(): Promise<boolean> {
    try {
      const user = await this.getCurrentUser();
      return !!user;
    } catch (error) {
      return false;
    }
  },
};
