import apiClient from "../index";

export type ImportType = "student" | "teacher";

export type ImportRowSeverity = "error" | "warning";
export type ImportRowKind = "skipped" | "failed";

export interface ImportRowIssue {
  row: number;
  field?: string;
  message: string;
  severity: ImportRowSeverity;
  kind?: ImportRowKind;
}

export type ImportJobStatus =
  | "draft"
  | "pending"
  | "processing"
  | "completed"
  | "failed";

export interface ImportPreviewResponse {
  previewId: string;
  status: "draft";
  fileName: string;
  total: number;
  valid: number;
  skipped: number;
  failed: number;
  errorSummary: ImportRowIssue[];
}

export interface ConfirmImportResponse {
  jobId: string;
  status: "pending";
}

export interface ImportJobStatusResponse {
  id: string;
  type: ImportType;
  status: ImportJobStatus;
  fileName: string;
  total: number;
  imported: number;
  skipped: number;
  failed: number;
  progress: number;
  errorSummary: ImportRowIssue[] | null;
  errorFileUrl: string | null;
  createdAt: string;
  processedAt: string | null;
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function filenameFromDisposition(
  disposition: string | undefined,
  fallback: string,
) {
  if (!disposition) return fallback;
  const match = disposition.match(/filename="?([^";]+)"?/i);
  return match?.[1] ?? fallback;
}

export const importService = {
  preview: async (
    type: ImportType,
    file: File,
  ): Promise<ImportPreviewResponse> => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await apiClient.post<ImportPreviewResponse>(
      `/api/v1/imports/${type}/preview`,
      formData,
    );
    return response.data;
  },

  confirm: async (
    type: ImportType,
    previewId: string,
  ): Promise<ConfirmImportResponse> => {
    const response = await apiClient.post<ConfirmImportResponse>(
      `/api/v1/imports/${type}/confirm`,
      { previewId },
    );
    return response.data;
  },

  jobStatus: async (jobId: string): Promise<ImportJobStatusResponse> => {
    const response = await apiClient.get<ImportJobStatusResponse>(
      `/api/v1/imports/jobs/${jobId}`,
    );
    return response.data;
  },

  downloadTemplate: async (type: ImportType): Promise<void> => {
    const response = await apiClient.get(`/api/v1/imports/templates/${type}`, {
      responseType: "blob",
    });
    const filename = filenameFromDisposition(
      response.headers["content-disposition"],
      `${type}-import-template.csv`,
    );
    triggerDownload(response.data as Blob, filename);
  },

  downloadErrorReport: async (jobId: string): Promise<void> => {
    const response = await apiClient.get(
      `/api/v1/imports/jobs/${jobId}/errors`,
      {
        responseType: "blob",
      },
    );
    const filename = filenameFromDisposition(
      response.headers["content-disposition"],
      `import-errors.csv`,
    );
    triggerDownload(response.data as Blob, filename);
  },
};
