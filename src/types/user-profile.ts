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

export interface PublicUserProfile {
  user: {
    id: string;
    name: string;
    email: string;
    image: string | null;
    role: string | null;
    status?: string;
    banned?: boolean;
    banReason?: string | null;
    createdAt?: string;
  };
  profile: {
    bio: string | null;
    skills: string[];
    achievements: Achievement[];
  } | null;
  teacher: {
    title: string | null;
    joinDate: string | null;
  } | null;
  student: {
    studentId: string | null;
  } | null;
  courses?: Array<{
    id: string;
    code: string;
    title: string;
    status: string;
  }>;
  classrooms?: Array<{
    id: string;
    name: string;
    section: string | null;
    status: string;
    course: { id: string; code: string; title: string } | null;
  }>;
}

export interface UpdateProfileInput {
  image?: File | string;
  phone?: string;
  bio?: string;
  skills?: string[];
  achievements?: Achievement[];
}
