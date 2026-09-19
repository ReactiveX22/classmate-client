import { describe, it, expect } from "vitest";
import { AxiosError, type AxiosResponse } from "axios";
import { mapServerErrors } from "@/lib/utils/form-errors";
import { ErrorCode } from "@/types/errors";

function createAxiosError(
  message: string,
  response?: Partial<AxiosResponse>,
) {
  const error = new AxiosError(message, undefined, {}, undefined, response);
  return error;
}

describe("mapServerErrors", () => {
  const formValues = { name: "", email: "" };

  it("returns global error with default message for unknown error", () => {
    const result = mapServerErrors("something broke", formValues);
    expect(result).toEqual({
      type: "global",
      message: "An unexpected error occurred.",
    });
  });

  it("returns global error with Error.message for Error instances", () => {
    const result = mapServerErrors(new Error("bad request"), formValues);
    expect(result).toEqual({
      type: "global",
      message: "bad request",
    });
  });

  it("returns global error for Axios error without response data", () => {
    const error = createAxiosError("Network Error");
    const result = mapServerErrors(error, formValues);
    expect(result).toEqual({
      type: "global",
      message: "Network Error",
    });
  });

  it("returns field errors for VALIDATION_FAILED with matching fields", () => {
    const error = createAxiosError("Validation failed", {
      data: {
        errorCode: ErrorCode.VALIDATION_FAILED,
        message: "Validation failed",
        statusCode: 422,
        errors: [
          { field: "name", issue: "Name is required" },
          { field: "email", issue: "Email is invalid" },
        ],
      },
    });
    const result = mapServerErrors(error, formValues);
    expect(result).toEqual({
      type: "field",
      errors: [
        { field: "name", message: "Name is required" },
        { field: "email", message: "Email is invalid" },
      ],
      message: "Validation failed",
    });
  });

  it("returns field errors for DUPLICATE_KEY with matching fields", () => {
    const error = createAxiosError("Duplicate key error", {
      data: {
        errorCode: ErrorCode.DUPLICATE_KEY,
        message: "Duplicate key error",
        statusCode: 409,
        errors: [{ field: "email", issue: "Email already exists" }],
      },
    });
    const result = mapServerErrors(error, formValues);
    expect(result).toEqual({
      type: "field",
      errors: [{ field: "email", message: "Email already exists" }],
      message: "Duplicate key error",
    });
  });

  it("filters out errors for fields not in formValues", () => {
    const error = createAxiosError("Validation failed", {
      data: {
        errorCode: ErrorCode.VALIDATION_FAILED,
        message: "Validation failed",
        statusCode: 422,
        errors: [
          { field: "name", issue: "Name is required" },
          { field: "unknownField", issue: "Should be ignored" },
        ],
      },
    });
    const result = mapServerErrors(error, { name: "" });
    expect(result).toEqual({
      type: "field",
      errors: [{ field: "name", message: "Name is required" }],
      message: "Validation failed",
    });
  });

  it("returns global error for VALIDATION_FAILED without errors array", () => {
    const error = createAxiosError("Validation failed", {
      data: {
        errorCode: ErrorCode.VALIDATION_FAILED,
        message: "Validation failed",
        statusCode: 422,
      },
    });
    const result = mapServerErrors(error, formValues);
    expect(result).toEqual({
      type: "global",
      message: "Validation failed",
    });
  });

  it("returns global error for non-validation error codes", () => {
    const error = createAxiosError("Not found", {
      data: {
        errorCode: ErrorCode.NOT_FOUND,
        message: "Resource not found",
        statusCode: 404,
      },
    });
    const result = mapServerErrors(error, formValues);
    expect(result).toEqual({
      type: "global",
      message: "Resource not found",
    });
  });

  it("returns field errors (empty) for VALIDATION_FAILED with empty errors array", () => {
    const error = createAxiosError("Validation failed", {
      data: {
        errorCode: ErrorCode.VALIDATION_FAILED,
        message: "Validation failed",
        statusCode: 422,
        errors: [],
      },
    });
    const result = mapServerErrors(error, formValues);
    expect(result).toEqual({
      type: "field",
      errors: [],
      message: "Validation failed",
    });
  });
});
