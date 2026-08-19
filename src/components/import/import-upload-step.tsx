"use client";

import { ImportDropzone } from "@/components/import/import-dropzone";
import { Button } from "@/components/ui/button";
import {
  IconArrowRight,
  IconDownload,
  IconInfoCircle,
} from "@tabler/icons-react";

interface ImportUploadStepProps {
  type: "student" | "teacher";
  file: File | null;
  onFileChange: (file: File | null) => void;
  isPreviewing: boolean;
  onPreview: (file: File) => void;
  onDownloadTemplate: () => void;
}

export function ImportUploadStep({
  type,
  file,
  onFileChange,
  isPreviewing,
  onPreview,
  onDownloadTemplate,
}: ImportUploadStepProps) {
  return (
    <div className="flex flex-col gap-4">
      <ImportDropzone
        file={file}
        onFile={onFileChange}
        disabled={isPreviewing}
      />

      <div className="flex items-start gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2.5">
        <IconInfoCircle
          size={15}
          className="mt-0.5 shrink-0 text-muted-foreground"
        />
        <p className="text-xs leading-relaxed text-muted-foreground">
          Each row creates a new {type === "student" ? "student" : "teacher"}
          account. Rows whose email or ID already exist are skipped. Duplicates
          are never re-created.
        </p>
      </div>

      <Button
        variant="outline"
        className="justify-center"
        onClick={onDownloadTemplate}
      >
        <IconDownload />
        Download {type === "student" ? "student" : "teacher"} template
      </Button>

      <div className="flex justify-end gap-2">
        <Button
          onClick={() => file && onPreview(file)}
          disabled={!file || isPreviewing}
        >
          {isPreviewing ? "Reviewing file..." : "Review file"}
          {!isPreviewing && <IconArrowRight />}
        </Button>
      </div>
    </div>
  );
}
