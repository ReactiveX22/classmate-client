'use client';

import { useUser } from '@/hooks/useAuth';
import { Role } from '@/types/auth';
import { ReactNode } from 'react';

interface RoleGuardProps {
  allowedRoles: Role[];
  children: ReactNode;
  fallback?: ReactNode;
}

export function RoleGuard({
  allowedRoles,
  children,
  fallback = null,
}: RoleGuardProps) {
  const { data: user, isLoading } = useUser();

  if (isLoading) {
    return null;
  }

  if (!user || !user.role || !allowedRoles.includes(user.role)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
