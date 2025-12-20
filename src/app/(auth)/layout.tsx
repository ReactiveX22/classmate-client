'use client';

import { useUser } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { data: user } = useUser();

  if (user) {
    router.push('/dashboard');
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-muted/30 p-4'>
      <div className='w-full max-w-md'>{children}</div>
    </div>
  );
}
