"use client";

import { ImportPreviewStep } from "@/components/import/import-preview-step";
import { ImportProgressStep } from "@/components/import/import-progress-step";
import { ImportUploadStep } from "@/components/import/import-upload-step";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  importService,
  type ImportType,
} from "@/lib/api/services/import.service";
import { cn } from "@/lib/utils";
import {
  IconUsers,
  IconUpload,
  IconChartBar,
  IconLoader,
} from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { useImportFlow } from "@/hooks/use-import";

type Stage = "upload" | "preview" | "progress";

const STEPS: { id: Stage; label: string; icon: React.ElementType }[] = [
  { id: "upload", label: "Upload", icon: IconUpload },
  { id: "preview", label: "Review", icon: IconUsers },
  { id: "progress", label: "Import", icon: IconChartBar },
];

interface ImportDialogProps {
  type: ImportType;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  flow: ReturnType<typeof useImportFlow>;
}

export function ImportDialog({
  type,
  open,
  onOpenChange,
  flow,
}: ImportDialogProps) {
  const [stage, setStage] = useState<Stage>("upload");
  const [file, setFile] = useState<File | null>(null);

  const { job, preview, isPreviewing, isConfirming } = flow;
  const wasOpen = useRef(false);

  useEffect(() => {
    if (!open) return;
    if (!wasOpen.current) {
      if (flow.jobId) {
        setStage("progress");
      } else if (preview) {
        setStage("preview");
      } else {
        setStage("upload");
      }
    }
    wasOpen.current = true;
  }, [open, flow.jobId, preview]);

  useEffect(() => {
    if (!open) wasOpen.current = false;
  }, [open]);

  const handlePreview = async (file: File) => {
    try {
      await flow.previewFile(file);
      setStage("preview");
    } catch {
      // toast handled in the mutation onError
    }
  };

  const handleConfirm = async () => {
    if (!preview) return;
    try {
      await flow.confirm(preview.previewId);
      setStage("progress");
    } catch {
      // toast handled in the mutation onError
    }
  };

  const handleBack = () => {
    flow.clearPreview();
    setStage("upload");
  };

  const handleDownloadTemplate = () => {
    importService
      .downloadTemplate(type)
      .catch(() => toast.error("Could not download the template"));
  };

  const handleDownloadErrors = () => {
    if (!job) return;
    importService
      .downloadErrorReport(job.id)
      .catch(() => toast.error("Could not download the error report"));
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  const noun = type === "student" ? "students" : "teachers";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[calc(100%-2rem)] sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>
            Import {type === "student" ? "Students" : "Teachers"}
          </DialogTitle>
          <DialogDescription>
            Add many {noun} at once from a CSV or Excel file.
          </DialogDescription>
        </DialogHeader>

        <ol
          className="flex items-center"
          aria-label="Import steps"
        >
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            const active = stage === step.id;
            const stepIndex = STEPS.findIndex((s) => s.id === stage);
            const done = index < stepIndex;
            return (
              <li key={step.id} className="contents">
                <div
                  className={cn(
                    "flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
                    active
                      ? "bg-primary/10 text-primary"
                      : done
                        ? "text-foreground"
                        : "text-muted-foreground",
                  )}
                >
                  <Icon size={13} />
                  {step.label}
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={cn(
                      "h-px flex-1 mx-1.5",
                      index < stepIndex ? "bg-primary/40" : "bg-border",
                    )}
                  />
                )}
              </li>
            );
          })}
        </ol>

        {stage === "upload" && (
          <ImportUploadStep
            type={type}
            file={file}
            onFileChange={setFile}
            isPreviewing={isPreviewing}
            onPreview={handlePreview}
            onDownloadTemplate={handleDownloadTemplate}
          />
        )}

        {stage === "preview" && preview && (
          <ImportPreviewStep
            type={type}
            preview={preview}
            isConfirming={isConfirming}
            onConfirm={handleConfirm}
            onBack={handleBack}
          />
        )}

        {stage === "progress" &&
          (job ? (
            <ImportProgressStep
              type={type}
              job={job}
              onClose={handleClose}
              onDownloadErrors={handleDownloadErrors}
            />
          ) : (
            <div className="flex flex-col items-center gap-3 py-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <IconLoader className="animate-spin" size={20} />
              </div>
              <p className="text-sm text-muted-foreground">
                Starting import...
              </p>
            </div>
          ))}
      </DialogContent>
    </Dialog>
  );
}
