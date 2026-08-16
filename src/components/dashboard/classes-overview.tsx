"use client";

import { Button } from "@/components/ui/button";
import { useClassrooms } from "@/hooks/use-classrooms";
import { ChevronRight, GraduationCap } from "lucide-react";
import Link from "next/link";
import { ClassroomCard } from "./classroom-card";
import { DashboardSkeleton } from "./dashboard-skeleton";
import { RecentNotices } from "./recent-notices";
import { H2 } from "@/components/ui/typography";
import { UpcomingSection } from "./upcoming-section";

export function ClassesOverview({
  emptyState,
}: {
  emptyState: React.ReactNode;
}) {
  const { data: classroomsResponse, isLoading } = useClassrooms({
    limit: 50,
  });

  const classrooms = classroomsResponse?.data || [];

  const allUpcomingPosts = classrooms.flatMap((c) =>
    (c.upcoming || []).map((p) => ({
      ...p,
      classroomId: c.classroom.id,
      classroomName: c.classroom.name,
    })),
  );

  const upcomingDeadlines = allUpcomingPosts
    .sort((a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime())
    .slice(0, 5);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary/10 text-primary">
                <GraduationCap size={20} />
              </div>
              <H2>Your Classes</H2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 sm:px-2.5"
              nativeButton={false}
              render={<Link href="/dashboard/classrooms" />}
            >
              <span className="hidden sm:inline">View All</span>
              <ChevronRight className="h-3 w-3 sm:ml-1" />
            </Button>
          </div>

          {classrooms.length === 0 ? (
            emptyState
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {classrooms.map((item) => (
                <ClassroomCard key={item.classroom.id} data={item} />
              ))}
            </div>
          )}
        </div>

        <RecentNotices />
      </div>

      <UpcomingSection items={upcomingDeadlines} />
    </div>
  );
}
