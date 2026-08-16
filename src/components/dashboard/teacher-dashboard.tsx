"use client";

import { CreateClassroomDialog } from "@/components/classrooms/create-classroom-dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Book } from "lucide-react";
import { ClassesOverview } from "./classes-overview";
import { DashboardPageShell } from "./dashboard-page-shell";

export function TeacherDashboard() {
  return (
    <DashboardPageShell action={<CreateClassroomDialog />}>
      <ClassesOverview
        emptyState={
          <Card className="border-dashed shadow-none">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <div className="p-3 rounded-full bg-primary/10 mb-4">
                <Book className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">No Classes Yet</h3>
              <p className="text-sm text-muted-foreground max-w-sm mt-1 mb-4">
                Get started by creating your first class.
              </p>
              <CreateClassroomDialog />
            </CardContent>
          </Card>
        }
      />
    </DashboardPageShell>
  );
}
