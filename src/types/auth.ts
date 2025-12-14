export interface Profile {
  firstName: string;
  lastName: string;
  displayName: string;
  phone?: string;
  bio?: string;
  // Teacher specific
  title?: string;
  joinDate?: string;
  // Student specific
  studentId?: string;
  id: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string;
  role?: string; // 'student' | 'instructor' | 'admin'
  banned: boolean;
  banReason?: string;
  banExpires?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  profile?: Profile;
  organizationId: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  name: string;
  email: string;
  password: string;
  role?: string; // Optional if you want to allow picking role on signup, though usually backend handles default
}

export interface AuthResponse {
  token: string;
  redirect: boolean;
  user: User;
}

export interface Session {
  user: User;
  token: string;
  expiresAt?: Date; // Optional as backend might not return it in this exact struct for standard JWT stateless flow, but good to keep if used locally
}

export interface AuthError {
  message: string;
  code?: string;
  field?: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  type: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  logo: string;
}

export enum UserStatus {
  Active = 'active',
  Pending = 'pending',
}
