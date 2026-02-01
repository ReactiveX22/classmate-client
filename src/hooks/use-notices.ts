import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  noticeService,
  GetNoticesParams,
  CreateNoticeInput,
  UpdateNoticeInput,
} from '@/lib/api/services/notice.service';

export const noticeKeys = {
  all: ['notices'] as const,
  lists: () => [...noticeKeys.all, 'list'] as const,
  list: (params: GetNoticesParams) => [...noticeKeys.lists(), params] as const,
  details: () => [...noticeKeys.all, 'detail'] as const,
  detail: (id: string) => [...noticeKeys.details(), id] as const,
};

export const useNotices = (params: GetNoticesParams) => {
  return useQuery({
    queryKey: noticeKeys.list(params),
    queryFn: () => noticeService.getNotices(params),
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
      queryClient.invalidateQueries({ queryKey: noticeKeys.detail(data.id) });
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
