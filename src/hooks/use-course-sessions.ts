import {
  CreateCourseSessionInput,
  UpdateCourseSessionInput,
  courseSessionService,
} from "@/lib/api/services/course-session.service";
import {
  createCourseSessionQueryOptions,
  getCourseSessionQueryOptions,
} from "@/lib/queryOptions/courseSessionQueryOptions";
import { PaginationParams } from "@/types/pagination";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { ApiError } from "@/types/errors";

export const useCourseSessions = (params?: PaginationParams) => {
  return useQuery({
    ...createCourseSessionQueryOptions(params),
    placeholderData: keepPreviousData,
  });
};

export const useCourseSession = (id: string) => {
  return useQuery(getCourseSessionQueryOptions(id));
};

export function useCreateCourseSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCourseSessionInput) =>
      courseSessionService.createCourseSession(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course-sessions"] });
      toast.success("Course session created successfully");
    },
    onError: (error: AxiosError<ApiError>) => {
      const apiError = error.response?.data;
      toast.error("Creation Failed", {
        description: apiError?.message || "An unexpected error occurred.",
      });
    },
  });
}

export function useUpdateCourseSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateCourseSessionInput;
    }) => courseSessionService.updateCourseSession(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course-sessions"] });
      toast.success("Course session updated successfully");
    },
    onError: (error: AxiosError<ApiError>) => {
      const apiError = error.response?.data;
      toast.error("Update Failed", {
        description: apiError?.message || "An unexpected error occurred.",
      });
    },
  });
}

export function useDeleteCourseSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => courseSessionService.deleteCourseSession(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course-sessions"] });
      toast.success("Course session deleted successfully");
    },
    onError: (error: AxiosError<ApiError>) => {
      const apiError = error.response?.data;
      toast.error("Deletion Failed", {
        description: apiError?.message || "An unexpected error occurred.",
      });
    },
  });
}
