export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  name: string;
  email: string;
  password: string;
  organizationName: string;
}

export interface AuthResponse {
  token: string;
  redirect: boolean;
  user: User;
}

export interface Session {
  user: User;
  token: string;
  expiresAt?: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string;
  role?: Role;
  status: UserStatus;
  banned: boolean;
  banReason?: string;
  banExpires?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  organizationId: string;
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

export enum Role {
  SuperAdmin = 'super-admin',
  Admin = 'admin',
  Instructor = 'instructor',
  Student = 'student',
  Staff = 'staff',
}
