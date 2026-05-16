import { infiniteQueryOptions } from "@tanstack/react-query";
import {
  postService,
  PostsQueryParams,
  PostsResponse,
} from "../api/services/post.service";

export function infinitePostsQueryOptions(
  classroomId: string,
  params?: Omit<PostsQueryParams, "page">,
) {
  return infiniteQueryOptions({
    queryKey: ["posts", classroomId, params],
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
