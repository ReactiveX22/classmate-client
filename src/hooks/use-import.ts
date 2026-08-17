import { handleApiError } from "@/lib/api";
import {
  importService,
  type ImportJobStatusResponse,
  type ImportPreviewResponse,
  type ImportType,
} from "@/lib/api/services/import.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function useImportFlow(type: ImportType) {
  const queryClient = useQueryClient();
  const [jobId, setJobId] = useState<string | null>(null);

  const previewMutation = useMutation({
    mutationFn: (file: File) => importService.preview(type, file),
    onError: (error: unknown) => {
      toast.error("Could not read the file", {
        description: handleApiError(error),
      });
    },
  });

  const confirmMutation = useMutation({
    mutationFn: (previewId: string) => importService.confirm(type, previewId),
    onSuccess: (data) => {
      setJobId(data.jobId);
      toast.success("Import started", {
        description: "You can close this window and check back later.",
      });
    },
    onError: (error: unknown) => {
      toast.error("Could not start the import", {
        description: handleApiError(error),
      });
    },
  });

  const jobQuery = useQuery({
    queryKey: ["import-job", type, jobId],
    queryFn: () => importService.jobStatus(jobId as string),
    enabled: Boolean(jobId),
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      if (
        status === "completed" ||
        status === "partial" ||
        status === "failed"
      ) {
        return false;
      }
      return 1500;
    },
  });

  const isTerminal =
    jobQuery.data?.status === "completed" ||
    jobQuery.data?.status === "partial" ||
    jobQuery.data?.status === "failed";

  useEffect(() => {
    if (!isTerminal) return;
    queryClient.invalidateQueries({
      queryKey: [type === "student" ? "students" : "teachers"],
    });
  }, [isTerminal, type, queryClient]);

  const reset = () => {
    if (jobId) {
      queryClient.removeQueries({ queryKey: ["import-job", type, jobId] });
    }
    setJobId(null);
    previewMutation.reset();
    confirmMutation.reset();
  };

  const clearPreview = () => {
    previewMutation.reset();
    confirmMutation.reset();
  };

  return {
    type,
    jobId,
    job: jobQuery.data as ImportJobStatusResponse | undefined,
    isRunning: Boolean(
      jobQuery.data?.status &&
      jobQuery.data.status !== "completed" &&
      jobQuery.data.status !== "partial" &&
      jobQuery.data.status !== "failed",
    ),
    isTerminal,
    preview: previewMutation.data as ImportPreviewResponse | undefined,
    isPreviewing: previewMutation.isPending,
    isConfirming: confirmMutation.isPending,
    previewFile: previewMutation.mutateAsync,
    confirm: confirmMutation.mutateAsync,
    reset,
    clearPreview,
  };
}
