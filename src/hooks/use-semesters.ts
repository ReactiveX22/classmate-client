import {
  CreateSemesterInput,
  UpdateSemesterInput,
  semesterService,
} from "@/lib/api/services/semester.service";
import {
  createSemesterQueryOptions,
  getSemesterQueryOptions,
} from "@/lib/queryOptions/semesterQueryOptions";
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

export const useSemesters = (params?: PaginationParams) => {
  return useQuery({
    ...createSemesterQueryOptions(params),
    placeholderData: keepPreviousData,
  });
};

export const useSemester = (id: string) => {
  return useQuery(getSemesterQueryOptions(id));
};

export function useCreateSemester() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateSemesterInput) =>
      semesterService.createSemester(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["semesters"] });
      toast.success("Semester created successfully");
    },
    onError: (error: AxiosError<ApiError>) => {
      const apiError = error.response?.data;
      toast.error("Creation Failed", {
        description: apiError?.message || "An unexpected error occurred.",
      });
    },
  });
}

export function useUpdateSemester() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSemesterInput }) =>
      semesterService.updateSemester(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["semesters"] });
      toast.success("Semester updated successfully");
    },
    onError: (error: AxiosError<ApiError>) => {
      const apiError = error.response?.data;
      toast.error("Update Failed", {
        description: apiError?.message || "An unexpected error occurred.",
      });
    },
  });
}

export function useDeleteSemester() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => semesterService.deleteSemester(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["semesters"] });
      toast.success("Semester deleted successfully");
    },
    onError: (error: AxiosError<ApiError>) => {
      const apiError = error.response?.data;
      toast.error("Deletion Failed", {
        description: apiError?.message || "An unexpected error occurred.",
      });
    },
  });
}
