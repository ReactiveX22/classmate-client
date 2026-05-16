import { useInfiniteQuery } from "@tanstack/react-query";
import { infinitePostsQueryOptions } from "@/lib/queryOptions/postQueryOptions";
import { PostsQueryParams } from "@/lib/api/services/post.service";

export const usePosts = (
  classroomId: string,
  params?: Omit<PostsQueryParams, "page">,
) => {
  return useInfiniteQuery(infinitePostsQueryOptions(classroomId, params));
};
