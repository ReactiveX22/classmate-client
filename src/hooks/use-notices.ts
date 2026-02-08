import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from '@tanstack/react-query';
import {
  noticeService,
  GetNoticesParams,
  CreateNoticeInput,
  UpdateNoticeInput,
  NoticesResponse,
} from '@/lib/api/services/notice.service';

export const noticeKeys = {
  all: ['notices'] as const,
  lists: () => [...noticeKeys.all, 'list'] as const,
  list: (params: GetNoticesParams) => [...noticeKeys.lists(), params] as const,
  details: () => [...noticeKeys.all, 'detail'] as const,
  detail: (id: string) => [...noticeKeys.details(), id] as const,
};

export const useNotices = (params: GetNoticesParams) => {
  return useInfiniteQuery({
    queryKey: noticeKeys.list(params),
    queryFn: ({ pageParam }: { pageParam: number }) =>
      noticeService.getNotices({ ...params, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage: NoticesResponse) => {
      if (lastPage.meta.hasNextPage) {
        return lastPage.meta.page + 1;
      }
      return undefined;
    },
  });
};

export const useNotice = (
  id: string | null,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: noticeKeys.detail(id!),
    queryFn: () => noticeService.getNotice(id!),
    enabled: !!id && (options?.enabled ?? true),
  });
};

export const useRecentNotices = (limit: number = 5) => {
  return useQuery({
    queryKey: noticeKeys.lists(),
    queryFn: () =>
      noticeService.getNotices({
        limit,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      }),
  });
};

export const useCreateNotice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateNoticeInput) => noticeService.createNotice(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: noticeKeys.lists() });
    },
  });
};

export const useUpdateNotice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateNoticeInput }) =>
      noticeService.updateNotice(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: noticeKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: noticeKeys.detail(data.id),
      });
    },
  });
};

export const useDeleteNotice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => noticeService.deleteNotice(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: noticeKeys.lists() });
    },
  });
};
