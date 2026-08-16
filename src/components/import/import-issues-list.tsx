"use client";

import { Badge } from "@/components/ui/badge";
import { IconAlertCircle, IconAlertTriangle } from "@tabler/icons-react";
import type { ImportRowIssue } from "@/lib/api/services/import.service";
import { cn } from "@/lib/utils";

interface ImportIssuesListProps {
  issues: ImportRowIssue[];
}

const ERROR_MESSAGES = new Set(["error", "failed"]);

export function ImportIssuesList({ issues }: ImportIssuesListProps) {
  if (issues.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-xl border border-border bg-muted/30 py-8 text-center">
        <IconAlertCircle size={20} className="text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          No issues found in this file.
        </p>
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-1.5">
      {issues.map((issue, index) => {
        const isError =
          issue.severity === "error" || ERROR_MESSAGES.has(issue.kind ?? "");
        return (
          <li
            key={`${issue.row}-${issue.field ?? "row"}-${index}`}
            className="flex items-start gap-2.5 rounded-lg border border-border bg-card px-3 py-2.5"
          >
            {isError ? (
              <IconAlertCircle
                size={15}
                className="mt-0.5 shrink-0 text-destructive"
              />
            ) : (
              <IconAlertTriangle
                size={15}
                className="mt-0.5 shrink-0 text-amber-500"
              />
            )}
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <div className="flex flex-wrap items-center gap-1.5">
                <Badge
                  variant="outline"
                  className="h-4.5 rounded px-1.5 text-[11px]"
                >
                  Row {issue.row}
                </Badge>
                {issue.field && (
                  <span
                    className={cn(
                      "text-[11px] font-medium uppercase tracking-wide text-muted-foreground",
                    )}
                  >
                    {issue.field}
                  </span>
                )}
                <Badge
                  variant={isError ? "destructive" : "secondary"}
                  className="h-4.5 rounded px-1.5 text-[11px]"
                >
                  {issue.kind === "skipped"
                    ? "Skipped"
                    : issue.kind === "failed"
                      ? "Failed"
                      : isError
                        ? "Error"
                        : "Warning"}
                </Badge>
              </div>
              <p className="text-[13px] leading-snug text-muted-foreground">
                {issue.message}
              </p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
