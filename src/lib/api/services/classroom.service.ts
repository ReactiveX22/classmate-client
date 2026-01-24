import { User } from '@/types/auth';
import apiClient from '../index';
import { PaginationMeta, PaginationParams } from '@/types/pagination';

export interface Classroom {
  id: string;
  courseId: string;
  teacherId: string;
  name: string;
  section: string;
  classCode: string;
  description: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface Course {
  id: string;
  organizationId: string;
  teacherId: string | null;
  code: string;
  title: string;
  description: string | null;
  credits: number;
  semester: string;
  status: string;
  maxStudents: number;
  createdAt: string;
  updatedAt: string;
}

export interface ClassroomWithCourse {
  classroom: Classroom;
  course: Course;
}

export interface ClassroomMember {
  classroomId: string;
  studentId: string;
  joinedAt: string;
  student: User;
}

export interface ClassroomDetail extends Classroom {
  course: Course;
  teacher: User;
  classroomMembers: ClassroomMember[];
}

export interface CreateClassroomInput {
  courseId: string;
  name: string;
  section: string;
  description?: string;
  maxStudents?: number;
}

export interface UpdateClassroomInput {
  courseId?: string;
  teacherId?: string;
  name?: string;
  section?: string;
  description?: string;
  status?: string;
}

export interface ClassroomsResponse {
  data: ClassroomWithCourse[];
  meta: PaginationMeta;
}

export interface AssignmentSubmission {
  id: string;
  postId: string;
  studentId: string;
  content: string | null;
  attachments: any[] | null;
  status: string;
  grade: number | null;
  feedback: string | null;
  gradedById: string | null;
  submittedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AssignmentWithSubmission {
  id: string;
  classroomId: string;
  authorId: string;
  type: 'assignment' | 'announcement' | 'material';
  title: string;
  content: string;
  attachments: any[];
  assignmentData: {
    points: number;
    dueDate: string | null;
    submissionType: string;
    allowLateSubmission: boolean;
  } | null;
  isPinned: boolean;
  commentsEnabled: boolean;
  createdAt: string;
  updatedAt: string;
  submissions: AssignmentSubmission[];
}

export interface GradeStats {
  overall_grade: number;
  missing_work: number;
  attendance: number;
}

export interface StudentGradeStatsResponse {
  assignments: AssignmentWithSubmission[];
  gradeStats: GradeStats;
}

export interface StudentAttendanceStats {
  present: number;
  late: number;
  absent: number;
  excused: number;
  total: number;
  attendanceRate: number;
}

export interface AttendanceChecklistItem {
  id: string; // This is actually user id/enrollment id in some cases, or just a unique key
  name: string;
  image: string | null;
  studentId: string;
  attendanceId: string | null;
  status: 'present' | 'absent' | 'late' | null;
  remarks: string | null;
}

export interface BulkCreateAttendanceInput {
  date: string;
  records: {
    studentId: string;
    status: 'present' | 'absent' | 'late';
    remarks?: string;
  }[];
}

export const classroomService = {
  getClassrooms: async (
    params?: PaginationParams,
  ): Promise<ClassroomsResponse> => {
    const response = await apiClient.get<ClassroomsResponse>(
      '/api/v1/classrooms',
      {
        params,
      },
    );
    return response.data;
  },

  getClassroomById: async (id: string): Promise<ClassroomDetail> => {
    const response = await apiClient.get<ClassroomDetail>(
      `/api/v1/classrooms/${id}`,
    );
    return response.data;
  },

  createClassroom: async (
    payload: CreateClassroomInput,
  ): Promise<Classroom> => {
    const response = await apiClient.post<Classroom>(
      '/api/v1/classrooms',
      payload,
    );
    return response.data;
  },

  updateClassroom: async (
    id: string,
    payload: UpdateClassroomInput,
  ): Promise<Classroom> => {
    const response = await apiClient.patch<Classroom>(
      `/api/v1/classrooms/${id}`,
      payload,
    );
    return response.data;
  },

  deleteClassroom: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/v1/classrooms/${id}`);
  },

  addStudentsToClassroom: async (
    classroomId: string,
    studentIds: string[],
  ): Promise<void> => {
    await apiClient.post(`/api/v1/classrooms/${classroomId}/members`, {
      studentIds,
    });
  },

  removeStudentsFromClassroom: async (
    classroomId: string,
    studentIds: string[],
  ): Promise<void> => {
    await apiClient.delete(`/api/v1/classrooms/${classroomId}/members`, {
      data: { studentIds },
    });
  },

  joinClassroom: async (classCode: string): Promise<void> => {
    await apiClient.post('/api/v1/classrooms/join', {
      classCode,
    });
  },

  getStudentGradeStats: async (
    classroomId: string,
    studentId: string,
  ): Promise<StudentGradeStatsResponse> => {
    const response = await apiClient.get<StudentGradeStatsResponse>(
      `/api/v1/classrooms/${classroomId}/students/${studentId}/grade-stats`,
    );
    return response.data;
  },

  getAttendanceChecklist: async (
    classroomId: string,
    date?: string,
  ): Promise<AttendanceChecklistItem[]> => {
    const response = await apiClient.get<AttendanceChecklistItem[]>(
      `/api/v1/classrooms/${classroomId}/attendances/checklist`,
      {
        params: { date },
      },
    );
    return response.data;
  },

  bulkCreateAttendance: async (
    classroomId: string,
    payload: BulkCreateAttendanceInput,
  ): Promise<void> => {
    await apiClient.post(
      `/api/v1/classrooms/${classroomId}/attendances/bulk`,
      payload,
    );
  },

  getStudentAttendanceStats: async (
    classroomId: string,
    studentId: string,
  ): Promise<StudentAttendanceStats> => {
    const response = await apiClient.get<StudentAttendanceStats>(
      `/api/v1/classrooms/${classroomId}/attendances/stats/${studentId}`,
    );
    return response.data;
  },

  leaveClassroom: async (classroomId: string): Promise<void> => {
    await apiClient.post(`/api/v1/classrooms/${classroomId}/members/leave`);
  },
};
