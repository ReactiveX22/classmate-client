'use client';

import { useSession } from '@/hooks/useAuth';
import { IconLoader } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !session?.user) {
      console.log('[ProtectedRoute] No session found, redirecting to login');
      router.push('/login');
    }
  }, [session, isPending, router]);

  if (isPending) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-primary'>
          <IconLoader className='size-4 animate-spin' />
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  return <>{children}</>;
}
