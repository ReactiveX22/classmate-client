import { useInfiniteQuery } from '@tanstack/react-query';
import { infinitePostsQueryOptions } from '@/lib/queryOptions/postQueryOptions';
import { PaginationParams } from '@/types/pagination';

export const usePosts = (
  classroomId: string,
  params?: Omit<PaginationParams, 'page'>
) => {
  return useInfiniteQuery(infinitePostsQueryOptions(classroomId, params));
};
