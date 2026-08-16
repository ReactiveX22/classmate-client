"use client";

import { format } from "date-fns";
import { H1, Muted } from "@/components/ui/typography";
import { useUser } from "@/hooks/useAuth";

export function DashboardPageShell({
  action,
  children,
}: {
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  const { data: user } = useUser();

  return (
    <div className="container mx-auto p-6 space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <H1>Welcome, {user?.name}</H1>
          <Muted>{format(new Date(), "EEEE, MMMM do, yyyy")}</Muted>
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}
