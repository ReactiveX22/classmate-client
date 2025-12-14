import { ErrorCode } from '@/types/errors';

export class AppError extends Error {
  constructor(
    public errorCode: ErrorCode,
    message: string,
    public statusCode?: number,
    public details?: unknown
  ) {
    super(message);
    this.name = 'AppError';
  }
}
