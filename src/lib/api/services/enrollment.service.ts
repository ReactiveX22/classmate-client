import apiClient from '../index';

export interface CreateEnrollmentInput {
  studentId: string;
  courseId: string;
}

export interface EnrollmentResponse {
  studentId: string;
  courseId: string;
  enrollAt: string;
}

export const enrollmentService = {
  createEnrollment: async (
    payload: CreateEnrollmentInput
  ): Promise<EnrollmentResponse> => {
    const response = await apiClient.post<EnrollmentResponse>(
      '/api/v1/enrollments',
      payload
    );
    return response.data;
  },
};
