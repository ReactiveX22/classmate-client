"use client";

import { buttonVariants } from "@/components/ui/button";
import { DashboardPageShell } from "./dashboard-page-shell";
import { RecentNotices } from "./recent-notices";
import { StatsCards } from "./stats-cards";
import { Plus } from "lucide-react";
import Link from "next/link";

const publishButton = (
  <Link
    href="/dashboard/notices/new"
    className={buttonVariants({ variant: "default", size: "default" })}
  >
    <Plus className="h-4 w-4 mr-2" />
    Publish Notice
  </Link>
);

export function AdminDashboard() {
  return (
    <DashboardPageShell action={publishButton}>
      <StatsCards />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <RecentNotices
            emptyAction={publishButton}
            emptyDescription="Get started by creating your first notice."
          />
        </div>
      </div>
    </DashboardPageShell>
  );
}
