"use client";

import { Button } from "@/components/ui/button";
import {
  IconAlertTriangle,
  IconCheck,
  IconCircleX,
  IconFileDownload,
  IconX,
} from "@tabler/icons-react";
import type {
  ImportJobStatusResponse,
  ImportType,
} from "@/lib/api/services/import.service";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

interface ImportProgressStepProps {
  type: ImportType;
  job: ImportJobStatusResponse;
  onClose: () => void;
  onDownloadErrors: () => void;
}

interface CounterProps {
  label: string;
  value: number;
  className?: string;
}

function Counter({ label, value, className }: CounterProps) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-xl border border-border bg-card px-4 py-3">
      <span
        className={`text-xl font-semibold tabular-nums tracking-tight ${className ?? ""}`}
      >
        {value}
      </span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}

const isTerminal = (job: ImportJobStatusResponse) =>
  job.status === "completed" ||
  job.status === "partial" ||
  job.status === "failed";

export function ImportProgressStep({
  type,
  job,
  onClose,
  onDownloadErrors,
}: ImportProgressStepProps) {
  const noun = type === "student" ? "students" : "teachers";
  const finished = isTerminal(job);
  const succeeded = job.status === "completed" || job.status === "partial";
  const hasProgress = job.progress > 0;
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const next = finished ? 100 : Math.max(0, job.progress);
    const timer = requestAnimationFrame(() => setWidth(next));
    return () => cancelAnimationFrame(timer);
  }, [job.progress, finished]);

  return (
    <div className="flex flex-col gap-5">
      {succeeded ? (
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-500">
            <IconCheck size={24} />
          </div>
          <p className="text-sm font-semibold">
            {job.status === "partial" ? "Import finished" : "Import complete"}
          </p>
          <p className="max-w-xs text-xs leading-relaxed text-muted-foreground">
            {job.imported} {noun} were added from{" "}
            <span className="font-medium text-foreground">{job.fileName}</span>.
          </p>
        </div>
      ) : job.status === "failed" ? (
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <IconCircleX size={24} />
          </div>
          <p className="text-sm font-semibold">Import failed</p>
          <p className="max-w-xs text-xs leading-relaxed text-muted-foreground">
            We couldn&apos;t finish importing{" "}
            <span className="font-medium text-foreground">{job.fileName}</span>.
            The import stopped before it could complete.
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2 text-center">
          <motion.div
            className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary"
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          >
            <IconFileDownload size={22} />
          </motion.div>
          <p className="text-sm font-semibold">Importing {noun}...</p>
          <p className="max-w-xs text-xs text-muted-foreground">
            {job.fileName} · {job.progress}%
          </p>
        </div>
      )}

      {!finished && (
        <div className="flex flex-col gap-3">
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            {hasProgress ? (
              <div
                className="h-full rounded-full bg-primary transition-all duration-700 ease-out"
                style={{ width: `${width}%` }}
              />
            ) : (
              <motion.div
                className="h-full w-1/3 rounded-full bg-primary"
                animate={{ x: ["-100%", "400%"] }}
                transition={{
                  duration: 1.4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            )}
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Counter
              label="Added"
              value={job.imported}
              className="text-emerald-600 dark:text-emerald-500"
            />
            <Counter
              label="Skipped"
              value={job.skipped}
              className="text-amber-600 dark:text-amber-500"
            />
            <Counter
              label="Failed"
              value={job.failed}
              className="text-destructive"
            />
          </div>
        </div>
      )}

      {succeeded && job.failed > 0 && (
        <div className="flex items-start gap-2 rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-2.5">
          <IconAlertTriangle
            size={15}
            className="mt-0.5 shrink-0 text-amber-600 dark:text-amber-500"
          />
          <p className="text-xs leading-relaxed text-muted-foreground">
            {job.failed} row{job.failed === 1 ? "" : "s"} failed and{" "}
            {job.skipped} were skipped. Download the error report for details.
          </p>
        </div>
      )}

      {succeeded && job.failed === 0 && job.skipped > 0 && (
        <div className="flex items-start gap-2 rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-2.5">
          <IconAlertTriangle
            size={15}
            className="mt-0.5 shrink-0 text-amber-600 dark:text-amber-500"
          />
          <p className="text-xs leading-relaxed text-muted-foreground">
            {job.skipped} row{job.skipped === 1 ? "" : "s"} were skipped because
            they already existed.
          </p>
        </div>
      )}

      {finished && job.errorFileUrl && (
        <Button variant="outline" onClick={onDownloadErrors}>
          <IconFileDownload />
          Download error report
        </Button>
      )}

      {finished && (
        <div className="flex justify-end">
          <Button onClick={onClose}>
            {succeeded ? "Done" : "Close"}
            {succeeded ? <IconCheck /> : <IconX />}
          </Button>
        </div>
      )}
    </div>
  );
}
