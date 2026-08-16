"use client";

import { JoinClassroomDialog } from "@/components/classrooms/join-classroom-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Book } from "lucide-react";
import Link from "next/link";
import { ClassesOverview } from "./classes-overview";
import { DashboardPageShell } from "./dashboard-page-shell";

export function StudentDashboard() {
  return (
    <DashboardPageShell action={<JoinClassroomDialog />}>
      <ClassesOverview
        emptyState={
          <Card className="border-dashed shadow-none">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <div className="p-3 rounded-full bg-primary/10 mb-4">
                <Book className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">No Classes Yet</h3>
              <p className="text-sm text-muted-foreground max-w-sm mt-1 mb-4">
                You aren&apos;t enrolled in any classes yet.
              </p>
              <Button
                render={<Link href="/dashboard/classrooms/join">Join Class</Link>}
                nativeButton={false}
              />
            </CardContent>
          </Card>
        }
      />
    </DashboardPageShell>
  );
}
