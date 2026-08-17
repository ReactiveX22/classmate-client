"use client";

import { ImportIssuesList } from "@/components/import/import-issues-list";
import { Button } from "@/components/ui/button";
import {
  IconArrowLeft,
  IconArrowRight,
  IconCheck,
  IconCircleCheck,
  IconCircleDashed,
  IconCircleX,
} from "@tabler/icons-react";
import type { ImportPreviewResponse } from "@/lib/api/services/import.service";
import { cn } from "@/lib/utils";

interface ImportPreviewStepProps {
  type: "student" | "teacher";
  preview: ImportPreviewResponse;
  isConfirming: boolean;
  onConfirm: () => void;
  onBack: () => void;
}

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: number;
  tone: "success" | "warning" | "danger";
  hint: string;
}

const toneClasses: Record<StatCardProps["tone"], string> = {
  success: "text-emerald-600 dark:text-emerald-500",
  warning: "text-amber-600 dark:text-amber-500",
  danger: "text-destructive",
};

const iconBgClasses: Record<StatCardProps["tone"], string> = {
  success: "bg-emerald-500/10",
  warning: "bg-amber-500/10",
  danger: "bg-destructive/10",
};

function StatCard({ icon: Icon, label, value, tone, hint }: StatCardProps) {
  return (
    <div className="flex flex-col rounded-xl border border-border bg-card p-3.5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium leading-none">{label}</span>
        <div
          className={cn(
            "flex h-7 w-7 items-center justify-center rounded-lg",
            iconBgClasses[tone],
          )}
        >
          <Icon size={14} className={toneClasses[tone]} />
        </div>
      </div>
      <div className="mt-2 text-2xl font-semibold leading-none tabular-nums tracking-tight">
        {value}
      </div>
      <div className="mt-1 text-xs text-muted-foreground">{hint}</div>
    </div>
  );
}

export function ImportPreviewStep({
  type,
  preview,
  isConfirming,
  onConfirm,
  onBack,
}: ImportPreviewStepProps) {
  const noun = type === "student" ? "students" : "teachers";
  const hasBlockingIssues = preview.failed > 0;
  const canConfirm = preview.valid > 0;

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-3 gap-3">
        <StatCard
          icon={IconCircleCheck}
          label="Ready to import"
          value={preview.valid}
          tone="success"
          hint="Valid rows"
        />
        <StatCard
          icon={IconCircleDashed}
          label="Will be skipped"
          value={preview.skipped}
          tone="warning"
          hint="Already exist"
        />
        <StatCard
          icon={IconCircleX}
          label="Failed"
          value={preview.failed}
          tone="danger"
          hint="Invalid rows"
        />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Issue summary</span>
          {preview.errorSummary.length > 0 && (
            <span className="text-xs text-muted-foreground">
              {preview.errorSummary.length} issue
              {preview.errorSummary.length === 1 ? "" : "s"}
            </span>
          )}
        </div>
        <div className="max-h-56 overflow-y-auto pr-1">
          <ImportIssuesList issues={preview.errorSummary} />
        </div>
      </div>

      {hasBlockingIssues && (
        <div className="flex items-start gap-2 rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2.5">
          <IconCircleX size={15} className="mt-0.5 shrink-0 text-destructive" />
          <p className="text-xs leading-relaxed text-destructive">
            {preview.failed} row{preview.failed === 1 ? "" : "s"} could not be
            read. {preview.valid} valid {noun} will still be imported.
          </p>
        </div>
      )}

      <div className="flex justify-between gap-2">
        <Button variant="outline" onClick={onBack} disabled={isConfirming}>
          <IconArrowLeft />
          Back
        </Button>
        <Button onClick={onConfirm} disabled={!canConfirm || isConfirming}>
          {isConfirming ? (
            "Starting import..."
          ) : (
            <>
              Import {preview.valid} {noun}
              <IconArrowRight />
            </>
          )}
        </Button>
      </div>

      {!canConfirm && (
        <p className="flex items-center justify-end gap-1.5 text-xs text-muted-foreground">
          <IconCheck size={13} className="text-destructive" />
          Nothing to import. Fix the rows above and upload the file again.
        </p>
      )}
    </div>
  );
}
