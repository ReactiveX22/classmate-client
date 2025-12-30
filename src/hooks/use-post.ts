import { useQuery } from '@tanstack/react-query';
import { postService } from '../lib/api/services/post.service';

export function usePost(classroomId: string, postId: string) {
  return useQuery({
    queryKey: ['post', classroomId, postId],
    queryFn: () => postService.getPost(classroomId, postId),
    enabled: !!classroomId && !!postId,
  });
}
