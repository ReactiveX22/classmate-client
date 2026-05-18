import { queryOptions, UseQueryOptions } from "@tanstack/react-query";
import {
  Todo,
  TodosResponse,
  todoService,
} from "../api/services/todo.service";
import { PaginationParams } from "@/types/pagination";

export function createTodosQueryOptions<
  TData = TodosResponse,
  TError = Error,
>(
  params?: PaginationParams,
  options?: Omit<
    UseQueryOptions<TodosResponse, TError, TData>,
    "queryKey" | "queryFn"
  >,
) {
  return queryOptions({
    ...options,
    queryKey: ["todos", params],
    queryFn: () => todoService.getTodos(params),
    staleTime: 5 * 60 * 1000,
  });
}

export function getTodoQueryOptions<TData = Todo, TError = Error>(
  id: string,
  options?: Omit<
    UseQueryOptions<Todo, TError, TData>,
    "queryKey" | "queryFn"
  >,
) {
  return queryOptions({
    ...options,
    queryKey: ["todos", id],
    queryFn: () => todoService.getTodo(id),
  });
}
