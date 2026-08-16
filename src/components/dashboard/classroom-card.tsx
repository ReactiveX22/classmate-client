"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ClassroomWithCourse } from "@/lib/api/services/classroom.service";
import { IconCalendarEvent, IconUsers } from "@tabler/icons-react";
import Link from "next/link";

interface ClassroomCardProps {
  data: ClassroomWithCourse;
}

const colorPatterns = [
  "from-indigo-500 via-purple-500 to-pink-500",
  "from-blue-500 via-cyan-500 to-teal-500",
  "from-emerald-500 via-teal-500 to-cyan-500",
  "from-orange-500 via-amber-500 to-yellow-500",
  "from-rose-500 via-pink-500 to-fuchsia-500",
  "from-violet-500 via-purple-500 to-indigo-500",
];

const getPattern = (id: string) => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colorPatterns[Math.abs(hash) % colorPatterns.length];
};

export function ClassroomCard({ data }: ClassroomCardProps) {
  const { classroom, course, studentCount, teacher, upcoming } = data;
  const pattern = getPattern(classroom.id);

  return (
    <Link
      href={`/dashboard/classrooms/${classroom.id}`}
      className="group block h-full"
    >
      <Card className="pt-0 overflow-hidden border-none shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col group/card">
        <div className={`relative h-20 bg-gradient-to-br ${pattern}`}>
          <div className="absolute inset-0 bg-black/10" />
          <Badge className="absolute top-3 right-3 bg-black/30 border-none text-white font-medium">
            {course.code}
          </Badge>
        </div>

        <CardContent className="flex-1 flex flex-col gap-3 px-4">
          <div className="space-y-1">
            <h3 className="text-base font-semibold leading-tight line-clamp-1 group-hover/card:text-primary transition-colors">
              {classroom.name}
            </h3>
            <p className="text-xs text-muted-foreground">
              Section {classroom.section} • {course.credits} Credits
            </p>
          </div>

          <div className="mt-auto pt-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 min-w-0">
              <Avatar>
                <AvatarImage
                  src={teacher.image || undefined}
                  alt={teacher.name}
                />
                <AvatarFallback className="bg-primary/10 text-primary font-semibold leading-none">
                  {teacher.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col min-w-0">
                <span className="text-[13px] font-medium truncate">
                  {teacher.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  Instructor
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div
                className="flex items-center gap-1 text-muted-foreground"
                title="Students"
              >
                <IconUsers size={14} />
                <span className="text-[13px] font-medium tabular-nums leading-none">
                  {studentCount}
                </span>
              </div>
              {upcoming && upcoming.length > 0 && (
                <div
                  className="flex items-center gap-1 text-primary"
                  title="Upcoming Tasks"
                >
                  <IconCalendarEvent size={14} />
                  <span className="text-[13px] font-medium tabular-nums leading-none">
                    {upcoming.length}
                  </span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
