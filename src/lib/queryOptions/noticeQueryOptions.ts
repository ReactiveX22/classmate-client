import { noticeService } from '../api/services/notice.service';
import { queryOptions } from '@tanstack/react-query';

export const noticeQueryOptions = {
  all: () =>
    queryOptions({
      queryKey: ['notices'],
      queryFn: () => noticeService.getNotices(),
    }),
  detail: (id: string) =>
    queryOptions({
      queryKey: ['notices', id],
      queryFn: () => noticeService.getNotice(id),
    }),
};
