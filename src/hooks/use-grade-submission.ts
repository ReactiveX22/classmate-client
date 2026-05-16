import { useMutation, useQueryClient } from "@tanstack/react-query";
import { submissionService } from "@/lib/api/services/submission.service";
import { toast } from "sonner";
import { handleApiError } from "@/lib/api";

export const useGradeSubmission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      classroomId,
      postId,
      studentId,
      grade,
      feedback,
    }: {
      classroomId: string;
      postId: string;
      studentId: string;
      grade: number;
      feedback?: string;
    }) =>
      submissionService.gradeSubmission(
        classroomId,
        postId,
        studentId,
        grade,
        feedback,
      ),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["submissions", variables.classroomId, variables.postId],
      });
      toast.success("Grade updated successfully");
    },
    onError: (error: unknown) => {
      toast.error(handleApiError(error));
    },
  });
};
