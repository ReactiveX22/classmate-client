"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ClassroomDetail } from "@/lib/api/services/classroom.service";
import { cn, getInitials } from "@/lib/utils";
import { IconArrowLeft } from "@tabler/icons-react";
import { format } from "date-fns";
import { BookOpen, CalendarDays, GraduationCap, IdCard, Users } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface AdminClassroomViewProps {
  classroom: ClassroomDetail;
}

export function AdminClassroomView({ classroom }: AdminClassroomViewProps) {
  const router = useRouter();
  const { course, teacher, classroomMembers } = classroom;
  const enrolledCount = classroomMembers.length;

  return (
    <div className="container max-w-3xl mx-auto p-4 md:p-8 space-y-6">
      <Button
        variant="ghost"
        className="pl-0 hover:pl-2 transition-all gap-2 text-muted-foreground w-fit"
        onClick={() => router.back()}
      >
        <IconArrowLeft size={18} />
        Go back
      </Button>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="space-y-1">
                <CardTitle className="text-lg">{classroom.name}</CardTitle>
                <CardDescription>
                  {course ? `${course.code} • ` : ""}Section{" "}
                  {classroom.section}
                </CardDescription>
              </div>
              <Badge
                variant="outline"
                className={cn(
                  "capitalize",
                  classroom.status === "active"
                    ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                    : "bg-muted text-muted-foreground border-border",
                )}
              >
                {classroom.status}
              </Badge>
            </div>

            {teacher && (
              <div className="flex items-center gap-3">
                <Avatar className="size-9">
                  <AvatarImage src={teacher.image || ""} alt={teacher.name} />
                  <AvatarFallback className="bg-primary/10 text-xs">
                    {getInitials(teacher.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{teacher.name}</span>
                  <span className="text-xs text-muted-foreground">
                    Class Teacher
                  </span>
                </div>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <GraduationCap size={16} />
              <span>
                {course ? `${course.title} (${course.code})` : "No course"}
              </span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <IdCard size={16} />
              <span>
                Class code <code className="font-mono">{classroom.classCode}</code>
              </span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users size={16} />
              <span>
                {enrolledCount} / {course?.maxStudents ?? 0} students
              </span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <CalendarDays size={16} />
              <span>
                Created {format(new Date(classroom.createdAt), "MMMM d, yyyy")}
              </span>
            </div>
          </div>

          {classroom.description && (
            <div className="space-y-2 pt-2 border-t">
              <p className="text-sm font-medium">Description</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {classroom.description}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="size-4 text-muted-foreground" />
            Enrolled Students
          </CardTitle>
          <CardDescription>
            {enrolledCount} student
            {enrolledCount === 1 ? "" : "s"} in this classroom.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {classroomMembers.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No students have joined this classroom yet.
            </p>
          ) : (
            <ul className="space-y-2">
              {classroomMembers.map((member) => (
                <li key={member.studentId}>
                  <Link
                    href={`/dashboard/users/${member.student.id}`}
                    className="flex items-center gap-3 p-3 rounded-lg border bg-card text-card-foreground shadow-sm hover:border-primary/40 transition-colors"
                  >
                    <Avatar className="size-8">
                      <AvatarImage
                        src={member.student.image || ""}
                        alt={member.student.name}
                      />
                      <AvatarFallback className="bg-primary/10 text-xs">
                        {getInitials(member.student.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-medium truncate">
                        {member.student.name}
                      </span>
                      <span className="text-xs text-muted-foreground truncate">
                        {member.student.email}
                      </span>
                    </div>
                    <span className="ml-auto text-xs text-muted-foreground shrink-0">
                      Joined {format(new Date(member.joinedAt), "MMM d, yyyy")}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}