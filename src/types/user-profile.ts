export interface Achievement {
  id: string;
  title: string;
  issuer?: string;
  date: string;
  description?: string;
}

export interface UserProfile {
  id: string;
  userId: string;
  phone: string | null;
  bio: string | null;
  skills: string[];
  achievements: Achievement[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface TeacherProfile {
  id: string;
  userId: string;
  title: string;
  joinDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface StudentProfile {
  id: string;
  userId: string;
  studentId: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfileResponse {
  profile: UserProfile;
  teacher: TeacherProfile | null;
  student: StudentProfile | null;
}

export interface UpdateProfileInput {
  phone?: string;
  bio?: string;
  skills?: string[];
  achievements?: Achievement[];
}
