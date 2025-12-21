export const ErrorCode = {
  ORGANIZATION_ACCESS_DENIED: 'ORGANIZATION_ACCESS_DENIED',
  AUTH_ROLE_NOT_ASSIGNED: 'AUTH_ROLE_NOT_ASSIGNED',
  NOT_FOUND: 'NOT_FOUND',
  RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
  UNAUTHORIZED: 'UNAUTHORIZED',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  VALIDATION_FAILED: 'VALIDATION_FAILED',
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  DUPLICATE_KEY: 'DUPLICATE_KEY',
  TEACHER_NOT_FOUND_IN_ORG: 'TEACHER_NOT_FOUND_IN_ORG',
} as const;

export type ErrorCode = (typeof ErrorCode)[keyof typeof ErrorCode];

export interface ApiError {
  errorCode: ErrorCode;
  message: string;
  statusCode: number;
  details?: unknown;
  errors?: {
    field: string;
    issue: string;
  }[];
}
