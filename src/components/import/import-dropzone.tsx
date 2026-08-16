"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { IconFileSpreadsheet, IconX } from "@tabler/icons-react";
import { useCallback, useRef, useState } from "react";

const ACCEPTED_EXTENSIONS = [".csv", ".xlsx"];
const MAX_BYTES = 10 * 1024 * 1024;

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

interface ImportDropzoneProps {
  onFile: (file: File) => void;
  disabled?: boolean;
}

export function ImportDropzone({ onFile, disabled }: ImportDropzoneProps) {
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const acceptFile = useCallback(
    (candidate: File) => {
      const extension = candidate.name.toLowerCase().match(/\.[^.]*$/)?.[0];
      if (!extension || !ACCEPTED_EXTENSIONS.includes(extension)) {
        setError("Only .csv and .xlsx files are supported.");
        return;
      }
      if (candidate.size > MAX_BYTES) {
        setError("File is too large. Maximum size is 10 MB.");
        return;
      }
      setError(null);
      setFile(candidate);
      onFile(candidate);
    },
    [onFile],
  );

  return (
    <div className="flex flex-col gap-4">
      <input
        ref={inputRef}
        type="file"
        accept=".csv,.xlsx"
        className="sr-only"
        disabled={disabled}
        onChange={(event) => {
          const candidate = event.target.files?.[0];
          if (candidate) acceptFile(candidate);
          event.target.value = "";
        }}
      />

      <button
        type="button"
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => {
          event.preventDefault();
          if (!disabled) setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          if (disabled) return;
          const candidate = event.dataTransfer.files?.[0];
          if (candidate) acceptFile(candidate);
        }}
        className={cn(
          "flex min-h-40 w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border border-dashed px-6 py-8 text-center transition-colors",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none",
          dragging
            ? "border-primary bg-primary/5"
            : "border-border bg-muted/40 hover:border-primary/50 hover:bg-muted/60",
          disabled && "pointer-events-none opacity-60",
        )}
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <IconFileSpreadsheet size={20} />
        </div>
        <div className="flex flex-col items-center gap-0.5">
          <span className="text-sm font-medium text-foreground">
            {file ? file.name : "Drop your file here or click to browse"}
          </span>
          <span className="text-xs text-muted-foreground">
            {file
              ? `${formatBytes(file.size)} · click to replace`
              : "CSV or XLSX · up to 10 MB"}
          </span>
        </div>
      </button>

      {error && (
        <p className="flex items-center gap-1.5 text-xs font-medium text-destructive">
          <span className="text-destructive">{error}</span>
        </p>
      )}

      {file && !error && (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card px-3 py-2.5">
          <div className="flex min-w-0 items-center gap-2.5">
            <IconFileSpreadsheet size={16} className="shrink-0 text-primary" />
            <span className="truncate text-sm font-medium">{file.name}</span>
            <span className="shrink-0 text-xs text-muted-foreground">
              {formatBytes(file.size)}
            </span>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="shrink-0"
            onClick={() => {
              setFile(null);
              setError(null);
            }}
            aria-label="Remove file"
          >
            <IconX size={14} />
          </Button>
        </div>
      )}
    </div>
  );
}
