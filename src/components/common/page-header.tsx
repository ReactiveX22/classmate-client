import * as React from "react";
import { cn } from "@/lib/utils";
import { H2, Muted } from "@/components/ui/typography";

interface PageHeaderProps {
  icon?: React.ElementType;
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  icon: Icon,
  title,
  description,
  children,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      <div className="flex items-center gap-3 min-w-0">
        {Icon && (
          <div className="p-2 rounded-xl bg-primary/10 text-primary shrink-0">
            <Icon size={22} />
          </div>
        )}
        <div className="flex flex-col gap-1 min-w-0">
          <H2 className="truncate">{title}</H2>
          {description && <Muted className="truncate">{description}</Muted>}
        </div>
      </div>
      {children && <div className="flex items-center gap-3">{children}</div>}
    </div>
  );
}