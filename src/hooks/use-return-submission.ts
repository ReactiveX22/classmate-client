import { useMutation, useQueryClient } from "@tanstack/react-query";
import { submissionService } from "@/lib/api/services/submission.service";
import { toast } from "sonner";
import { handleApiError } from "@/lib/api";

export const useReturnSubmission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      classroomId,
      postId,
      submissionId,
    }: {
      classroomId: string;
      postId: string;
      submissionId: string;
    }) => submissionService.returnSubmission(classroomId, postId, submissionId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["submissions", variables.classroomId, variables.postId],
      });
      toast.success("Assignment returned successfully");
    },
    onError: (error: unknown) => {
      toast.error(handleApiError(error));
    },
  });
};
