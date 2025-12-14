import { UserStatus } from '@/types/auth';
import { createAuthClient } from 'better-auth/react';

export const authClient = createAuthClient({
  baseURL: typeof window !== 'undefined' ? window.location.origin : '',
  basePath: '/api/v1/auth',
  user: {
    additionalFields: {
      status: {
        type: 'string',
        defaultValue: UserStatus.Pending,
        input: false,
      },
      organizationId: {
        type: 'string',
        input: false,
        defaultValue: null,
      },
    },
  },
  fetchOptions: {
    cache: 'no-store',
    next: {
      revalidate: 0,
      tags: ['user'],
    },
  },
});

export const { signIn, signUp, signOut, useSession } = authClient;
