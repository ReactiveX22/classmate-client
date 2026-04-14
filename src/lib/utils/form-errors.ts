import { ApiError, ErrorCode } from '@/types/errors';

export function mapServerErrors(error: any, formValues: Record<string, any>) {
  const apiError = error.response?.data as ApiError;
  const mainMessage = apiError?.message || error.message || 'An unexpected error occurred.';

  if (
    (apiError?.errorCode === ErrorCode.VALIDATION_FAILED ||
      apiError?.errorCode === ErrorCode.DUPLICATE_KEY) &&
    apiError.errors
  ) {
    const relevantErrors = apiError.errors
      .filter((err) => err.field in formValues)
      .map((err) => ({ field: err.field, message: err.issue }));
    return { type: 'field' as const, errors: relevantErrors, message: mainMessage };
  }

  return { type: 'global' as const, message: mainMessage };
}
