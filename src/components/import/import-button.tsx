"use client";

import { ImportDialog } from "@/components/import/import-dialog";
import { ImportProgressChip } from "@/components/import/import-progress-chip";
import { Button } from "@/components/ui/button";
import { useImportFlow } from "@/hooks/use-import";
import { IconUpload } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { ImportType } from "@/lib/api/services/import.service";

interface ImportButtonProps {
  type: ImportType;
}

export function ImportButton({ type }: ImportButtonProps) {
  const flow = useImportFlow(type);
  const [open, setOpen] = useState(false);
  const completedRef = useRef(false);

  const isRunning = Boolean(flow.job && !flow.isTerminal);
  const justCompleted = flow.isTerminal && !completedRef.current;

  const imported = flow.job?.imported;
  const jobStatus = flow.job?.status;

  useEffect(() => {
    if (!flow.isTerminal) {
      completedRef.current = false;
      return;
    }
    if (!completedRef.current) {
      completedRef.current = true;
      const noun = type === "student" ? "students" : "teachers";
      if (jobStatus === "completed") {
        toast.success(`Import complete`, {
          description: `${imported} ${noun} added.`,
        });
      } else {
        toast.error("Import failed", {
          description: "No rows were imported. Check the error report.",
        });
      }
    }
  }, [flow.isTerminal, jobStatus, imported, type]);

  return (
    <>
      <Button
        variant="outline"
        onClick={() => {
          if (justCompleted) flow.reset();
          setOpen(true);
        }}
      >
        <IconUpload className="h-4 w-4" />
        Import
      </Button>

      {isRunning && !open && flow.job && (
        <ImportProgressChip
          fileName={flow.job.fileName}
          progress={flow.job.progress}
          onOpen={() => setOpen(true)}
        />
      )}

      <ImportDialog
        type={type}
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          if (!next && flow.isTerminal) {
            flow.reset();
            completedRef.current = false;
          }
        }}
        flow={flow}
      />
    </>
  );
}
