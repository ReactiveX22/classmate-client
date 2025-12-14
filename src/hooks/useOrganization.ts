import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { orgService } from '@/lib/api/services/organization.service';
import { AppError } from '@/utils/errors';
import { ErrorCode } from '@/types/errors';
import { toast } from 'sonner';
import { useEffect } from 'react';

export const organizationKeys = {
  all: ['organization'] as const,
  lists: () => [...organizationKeys.all, 'list'] as const,
  detail: (id: string) => [...organizationKeys.all, 'detail', id] as const,
};

export const useGetOrgById = (id: string) => {
  const router = useRouter();

  const query = useQuery({
    queryKey: organizationKeys.detail(id),
    queryFn: () => orgService.getOrgById(id),
    enabled: !!id,
    retry: (failureCount, error) => {
      // Don't retry on access denied
      if (
        error instanceof AppError &&
        error.errorCode === ErrorCode.ORGANIZATION_ACCESS_DENIED
      ) {
        return false;
      }
      return failureCount < 3;
    },
  });

  useEffect(() => {
    if (query.isError && query.error) {
      const error = query.error;

      if (error instanceof AppError) {
        switch (error.errorCode) {
          case ErrorCode.ORGANIZATION_ACCESS_DENIED:
            toast.error('Access Denied', {
              description:
                'You do not have permission to view this organization.',
            });
            break;
          case ErrorCode.NOT_FOUND:
            router.push('/404');
            break;
          default:
            toast.error('Error', {
              description: error.message || 'An unexpected error occurred.',
            });
            console.error('Organization error:', error);
        }
      } else {
        console.error('Organization generic error:', error);
        toast.error('Error', {
          description: 'Failed to load organization details.',
        });
      }
    }
  }, [query.isError, query.error, router]);

  return query;
};
