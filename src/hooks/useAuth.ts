'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService } from '@/lib/api/services/auth.service';
import { useSession as useBetterAuthSession } from '@/lib/auth-client';
import type { LoginCredentials, SignupCredentials } from '@/types/auth';
import { useRouter } from 'next/navigation';

export function useLogin() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) =>
      authService.login(credentials),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session'] });
      queryClient.invalidateQueries({ queryKey: ['user'] });
      router.push('/dashboard');
    },
    onError: (error: Error) => {
      console.error('Login failed:', error.message);
    },
  });
}

export function useSignup() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: SignupCredentials) =>
      authService.signup(credentials),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session'] });
      queryClient.invalidateQueries({ queryKey: ['user'] });
      router.push('/dashboard');
    },
    onError: (error: Error) => {
      console.error('Signup failed:', error.message);
    },
  });
}

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      queryClient.clear();
      router.push('/login');
    },
    onError: (error: Error) => {
      console.error('Logout failed:', error.message);
    },
  });
}

export function useSession() {
  return useBetterAuthSession();
}

export function useUser() {
  const { data: session, isPending, error, refetch } = useSession();
  return {
    data: session?.user ?? null,
    isLoading: isPending,
    error,
    refetch,
  };
}

export function useIsAuthenticated() {
  const { data: session, isPending } = useSession();
  return {
    isAuthenticated: !!session?.user,
    isLoading: isPending,
  };
}
