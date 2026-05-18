import {
  CreateTodoInput,
  UpdateTodoInput,
  todoService,
} from "@/lib/api/services/todo.service";
import {
  createTodosQueryOptions,
  getTodoQueryOptions,
} from "@/lib/queryOptions/todoQueryOptions";
import { PaginationParams } from "@/types/pagination";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { ApiError } from "@/types/errors";

export const useTodos = (params?: PaginationParams) => {
  return useQuery(createTodosQueryOptions(params));
};

export const useTodo = (id: string) => {
  return useQuery(getTodoQueryOptions(id));
};

export function useCreateTodo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateTodoInput) => todoService.createTodo(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
    onError: (error: AxiosError<ApiError>) => {
      const apiError = error.response?.data;
      toast.error("Creation Failed", {
        description: apiError?.message || "An unexpected error occurred.",
      });
    },
  });
}

export function useUpdateTodo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTodoInput }) =>
      todoService.updateTodo(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      queryClient.invalidateQueries({ queryKey: ["todos", variables.id] });
      toast.success("Todo updated successfully");
    },
    onError: (error: AxiosError<ApiError>) => {
      const apiError = error.response?.data;
      toast.error("Update Failed", {
        description: apiError?.message || "An unexpected error occurred.",
      });
    },
  });
}

export function useDeleteTodo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => todoService.deleteTodo(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      toast.success("Todo deleted successfully");
    },
    onError: (error: AxiosError<ApiError>) => {
      const apiError = error.response?.data;
      toast.error("Deletion Failed", {
        description: apiError?.message || "An unexpected error occurred.",
      });
    },
  });
}
