import { handleApiError } from "@/lib/api";
import { postService, VotePollDto } from "@/lib/api/services/post.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useVoteOnPoll = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      classroomId,
      postId,
      data,
    }: {
      classroomId: string;
      postId: string;
      data: VotePollDto;
    }) => postService.voteOnPoll(classroomId, postId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["posts", variables.classroomId],
        refetchType: "all",
      });
      queryClient.invalidateQueries({
        queryKey: ["post", variables.classroomId, variables.postId],
        refetchType: "all",
      });
    },
    onError: (error) => {
      const errorMessage = handleApiError(error);
      toast.error(`Failed to update poll vote: ${errorMessage}`);
    },
  });
};
