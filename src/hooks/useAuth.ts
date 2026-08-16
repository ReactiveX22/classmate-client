"use client";

import { authService } from "@/lib/api/services/auth.service";
import { useSession } from "@/lib/auth-client";
import type { LoginCredentials, SignupCredentials, User } from "@/types/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export function useLogin(redirectTo?: string) {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) =>
      authService.login(credentials),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["session"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
      const target =
        redirectTo && redirectTo.startsWith("/") ? redirectTo : "/dashboard";
      router.push(target);
    },
    onError: (error: Error) => {
      console.error("Login failed:", error.message);
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
      queryClient.invalidateQueries({ queryKey: ["session"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
      router.push("/dashboard");
    },
    onError: (error: Error) => {
      console.error("Signup failed:", error.message);
    },
  });
}

export function useRequestPasswordReset() {
  return useMutation({
    mutationFn: (email: string) => authService.requestPasswordReset(email),
    onError: (error: Error) => {
      console.error("Password reset request failed:", error.message);
    },
  });
}

export function useResetPassword() {
  const router = useRouter();

  return useMutation({
    mutationFn: ({
      newPassword,
      token,
    }: {
      newPassword: string;
      token: string;
    }) => authService.resetPassword(newPassword, token),
    onSuccess: () => {
      router.push("/login");
    },
    onError: (error: Error) => {
      console.error("Password reset failed:", error.message);
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
      router.push("/login");
    },
    onError: (error: Error) => {
      console.error("Logout failed:", error.message);
    },
  });
}

export function useImpersonate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => authService.impersonate(userId),
    onSuccess: () => {
      queryClient.clear();
      window.location.href = "/dashboard";
    },
    onError: (error: Error) => {
      console.error("Impersonation failed:", error.message);
    },
  });
}

export function useUser() {
  const { data: session, isPending, error, refetch } = useSession();
  return {
    data: (session?.user as User) ?? null,
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
