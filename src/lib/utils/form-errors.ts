import { ApiError, ErrorCode } from "@/types/errors";
import axios from "axios";

export function mapServerErrors(
  error: unknown,
  formValues: Record<string, unknown>,
) {
  let mainMessage = "An unexpected error occurred.";
  let apiError: ApiError | undefined;

  if (axios.isAxiosError(error)) {
    apiError = error.response?.data as ApiError;
    mainMessage = apiError?.message || error.message || mainMessage;
  } else if (error instanceof Error) {
    mainMessage = error.message;
  }

  if (
    apiError &&
    (apiError.errorCode === ErrorCode.VALIDATION_FAILED ||
      apiError.errorCode === ErrorCode.DUPLICATE_KEY) &&
    apiError.errors
  ) {
    const relevantErrors = apiError.errors
      .filter((err) => err.field in formValues)
      .map((err) => ({ field: err.field, message: err.issue }));
    return {
      type: "field" as const,
      errors: relevantErrors,
      message: mainMessage,
    };
  }

  return { type: "global" as const, message: mainMessage };
}
