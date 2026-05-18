import apiClient from "../index";
import { PaginationMeta } from "@/types/pagination";

export type TodoStatus = "pending" | "in_progress" | "completed";

export type TodoPriority = "low" | "medium" | "high";

export interface Todo {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  status: TodoStatus;
  priority: TodoPriority;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTodoInput {
  title: string;
  description?: string;
  priority?: TodoPriority;
  status?: TodoStatus;
}

export interface UpdateTodoInput {
  title?: string;
  description?: string;
  priority?: TodoPriority;
  status?: TodoStatus;
}

export interface TodosResponse {
  data: Todo[];
  meta: PaginationMeta;
}

export interface GetTodosParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
}

export const todoService = {
  getTodos: async (params?: GetTodosParams): Promise<TodosResponse> => {
    const response = await apiClient.get<TodosResponse>("/api/v1/todos", {
      params,
    });
    return response.data;
  },

  getTodo: async (id: string): Promise<Todo> => {
    const response = await apiClient.get<Todo>(`/api/v1/todos/${id}`);
    return response.data;
  },

  createTodo: async (payload: CreateTodoInput) => {
    const response = await apiClient.post<Todo>("/api/v1/todos", payload);
    return response.data;
  },

  updateTodo: async (id: string, payload: UpdateTodoInput) => {
    const response = await apiClient.patch<Todo>(`/api/v1/todos/${id}`, payload);
    return response.data;
  },

  deleteTodo: async (id: string) => {
    const response = await apiClient.delete(`/api/v1/todos/${id}`);
    return response.data;
  },
};
