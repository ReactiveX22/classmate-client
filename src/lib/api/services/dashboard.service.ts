import apiClient from "../index";

export interface AdminStats {
  studentsCount: number;
  teachersCount: number;
  coursesCount: number;
}

export const dashboardService = {
  getAdminStats: async (): Promise<AdminStats> => {
    const response = await apiClient.get<AdminStats>(
      "/api/v1/dashboard/admin/stats",
    );
    return response.data;
  },
};
