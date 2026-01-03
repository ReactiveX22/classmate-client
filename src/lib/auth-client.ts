import { UserStatus } from '@/types/auth';
import { createAuthClient } from 'better-auth/react';

export const authClient = createAuthClient({
  baseURL: process.env.API_URL,
  basePath: '/api/v1/auth',
  user: {
    additionalFields: {
      role: {
        type: 'string',
        input: false,
      },
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
      organizationName: {
        type: 'string',
        input: true,
        defaultValue: null,
      },
    },
  },
  plugins: [
    {
      id: 'next-cookies-request',
      fetchPlugins: [
        {
          id: 'next-cookies-request-plugin',
          name: 'next-cookies-request-plugin',
          hooks: {
            async onRequest(ctx: any) {
              if (typeof window === 'undefined') {
                const { cookies } = await import('next/headers');
                const headerList = await cookies();
                ctx.headers.set('cookie', headerList.toString());
              }
            },
          },
        },
      ],
    } as any,
  ],
});

export const { signIn, signUp, signOut, useSession } = authClient;

export type Session = typeof authClient.$Infer.Session;
