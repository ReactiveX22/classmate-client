"use client";

import { AddNoticeDialog } from "../notices/add-notice-dialog";
import { DashboardPageShell } from "./dashboard-page-shell";
import { RecentNotices } from "./recent-notices";
import { StatsCards } from "./stats-cards";

export function AdminDashboard() {
  return (
    <DashboardPageShell action={<AddNoticeDialog />}>
      <StatsCards />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <RecentNotices
            emptyAction={<AddNoticeDialog />}
            emptyDescription="Get started by creating your first notice."
          />
        </div>
      </div>
    </DashboardPageShell>
  );
}
