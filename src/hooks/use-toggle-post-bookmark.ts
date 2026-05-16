import { handleApiError } from "@/lib/api";
import { postService } from "@/lib/api/services/post.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useTogglePostBookmark = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      classroomId,
      postId,
      bookmarked,
    }: {
      classroomId: string;
      postId: string;
      bookmarked: boolean;
    }) => {
      if (bookmarked) {
        await postService.unbookmarkPost(classroomId, postId);
        return false;
      }

      await postService.bookmarkPost(classroomId, postId);
      return true;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["posts", variables.classroomId],
        refetchType: "all",
      });

      // Invalidate specific post query
      queryClient.invalidateQueries({
        queryKey: ["post", variables.classroomId, variables.postId],
        refetchType: "all",
      });
    },
    onError: (error) => {
      const message = handleApiError(error);
      toast.error(`Failed to update bookmark: ${message}`);
    },
  });
};
