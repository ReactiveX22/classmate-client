import apiClient from "../index";
import { PaginationMeta, PaginationParams } from "@/types/pagination";

export interface Semester {
  id: string;
  organizationId: string;
  ordinal: string;
  name: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSemesterInput {
  ordinal: string;
  name?: string;
}

export interface UpdateSemesterInput {
  ordinal?: string;
  name?: string;
}

export interface SemestersResponse {
  data: Semester[];
  meta: PaginationMeta;
}

export const semesterService = {
  getSemesters: async (
    params?: PaginationParams,
  ): Promise<SemestersResponse> => {
    const response = await apiClient.get<SemestersResponse>(
      "/api/v1/semesters",
      {
        params,
      },
    );
    return response.data;
  },

  getSemesterById: async (id: string): Promise<Semester> => {
    const response = await apiClient.get<Semester>(`/api/v1/semesters/${id}`);
    return response.data;
  },

  createSemester: async (payload: CreateSemesterInput): Promise<Semester> => {
    const response = await apiClient.post<Semester>(
      "/api/v1/semesters",
      payload,
    );
    return response.data;
  },

  updateSemester: async (
    id: string,
    payload: UpdateSemesterInput,
  ): Promise<Semester> => {
    const response = await apiClient.patch<Semester>(
      `/api/v1/semesters/${id}`,
      payload,
    );
    return response.data;
  },

  deleteSemester: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/v1/semesters/${id}`);
  },
};
