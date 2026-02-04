import { infiniteQueryOptions } from '@tanstack/react-query';
import { postService, PostsResponse } from '../api/services/post.service';
import { PaginationParams } from '@/types/pagination';

export function infinitePostsQueryOptions(
  classroomId: string,
  params?: Omit<PaginationParams, 'page'>,
) {
  return infiniteQueryOptions({
    queryKey: ['posts', classroomId, params],
    queryFn: ({ pageParam = 1 }) =>
      postService.getPosts(classroomId, {
        ...params,
        page: pageParam,
      }),
    getNextPageParam: (lastPage: PostsResponse) => {
      return lastPage.meta.hasNextPage ? lastPage.meta.page + 1 : undefined;
    },
    initialPageParam: 1,
  });
}
