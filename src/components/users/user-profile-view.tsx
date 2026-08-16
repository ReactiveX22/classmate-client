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
import { Skeleton } from "@/components/ui/skeleton";
import { cn, getInitials } from "@/lib/utils";
import type { PublicUserProfile } from "@/types/user-profile";
import { IconArrowLeft } from "@tabler/icons-react";
import { format } from "date-fns";
import {
  Ban,
  BookOpen,
  BriefcaseBusiness,
  CalendarDays,
  GraduationCap,
  IdCard,
  Trophy,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface UserProfileViewProps {
  data?: PublicUserProfile;
  isLoading: boolean;
  isError: boolean;
}

export function UserProfileView({
  data,
  isLoading,
  isError,
}: UserProfileViewProps) {
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="container max-w-3xl mx-auto p-4 md:p-8 space-y-6">
        <Skeleton className="h-4 w-24" />
        <Card>
          <CardHeader className="flex flex-row items-center gap-4 pb-2">
            <Skeleton className="size-16 md:size-20 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-56" />
            </div>
          </CardHeader>
        </Card>
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="container max-w-3xl mx-auto p-4 md:p-8">
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <UserRound className="size-12 text-muted-foreground mb-4" />
          <p className="text-destructive text-lg font-medium">
            Profile not found
          </p>
          <p className="text-muted-foreground mt-2">
            This user may not exist or you do not have access to their profile.
          </p>
          <Button
            variant="ghost"
            className="mt-6 pl-0 hover:pl-2 transition-all gap-2 text-muted-foreground"
            onClick={() => router.back()}
          >
            <IconArrowLeft size={18} />
            Go back
          </Button>
        </div>
      </div>
    );
  }

  const { user: profileUser, profile, teacher, student, courses, classrooms } =
    data;
  const roleBadge = profileUser.role?.replace("-", " ") ?? "Member";
  const isInstructor = profileUser.role === "instructor";
  const isAdminView = profileUser.status !== undefined;

  const backButton = (
    <Button
      variant="ghost"
      className="pl-0 hover:pl-2 transition-all gap-2 text-muted-foreground w-fit"
      onClick={() => router.back()}
    >
      <IconArrowLeft size={18} />
      Go back
    </Button>
  );

  return (
    <div className="container max-w-3xl mx-auto p-4 md:p-8 space-y-6">
      {backButton}

      <Card>
        <CardHeader className="flex flex-row items-center gap-4 pb-2">
          <Avatar className="size-16 md:size-20">
            <AvatarImage src={profileUser.image || ""} alt={profileUser.name} />
            <AvatarFallback className="bg-primary/10">
              {getInitials(profileUser.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-1">
            <CardTitle>{profileUser.name}</CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {profileUser.email}
            </div>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <Badge
                variant="secondary"
                className="w-fit text-[10px] capitalize"
              >
                {roleBadge}
              </Badge>
              {isAdminView && profileUser.status && (
                <Badge
                  variant="outline"
                  className="w-fit text-[10px] capitalize"
                >
                  {profileUser.status}
                </Badge>
              )}
              {isAdminView && profileUser.banned && (
                <Badge
                  variant="destructive"
                  className="w-fit text-[10px] gap-1"
                >
                  <Ban className="size-3" />
                  Banned
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {isAdminView && profileUser.createdAt && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CalendarDays size={16} className="text-muted-foreground" />
              <span>
                Account created{" "}
                {format(new Date(profileUser.createdAt), "MMMM d, yyyy")}
              </span>
            </div>
          )}

          {isAdminView && profileUser.banned && profileUser.banReason && (
            <div className="flex items-center gap-2 text-sm text-destructive">
              <Ban size={16} />
              <span>{profileUser.banReason}</span>
            </div>
          )}

          {student && (
            <div className="flex items-center gap-2 text-sm">
              <IdCard size={16} className="text-muted-foreground" />
              <span>{student.studentId || "No student ID"}</span>
            </div>
          )}

          {teacher && (
            <div className="space-y-1">
              {teacher.title && (
                <div className="flex items-center gap-2 text-sm font-medium">
                  <BriefcaseBusiness
                    size={16}
                    className="text-muted-foreground"
                  />
                  <span>{teacher.title}</span>
                </div>
              )}
              {teacher.joinDate && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground pl-6">
                  Joined at {format(new Date(teacher.joinDate), "MMMM d, yyyy")}
                </div>
              )}
            </div>
          )}

          {profile?.bio && (
            <div className="space-y-2 pt-2 border-t">
              <p className="text-sm font-medium">About</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {profile.bio}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {courses && courses.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="size-4 text-muted-foreground" />
              {isInstructor ? "Assigned Courses" : "Enrolled Courses"}
            </CardTitle>
            <CardDescription>
              {isInstructor
                ? "Courses this teacher is assigned to teach."
                : "Courses this student is enrolled in."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {courses.map((course) => (
                <li key={course.id}>
                  <Link
                    href={`/dashboard/courses/${course.id}`}
                    className="flex items-center justify-between gap-3 p-3 rounded-lg border bg-card text-card-foreground shadow-sm hover:border-primary/40 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <GraduationCap
                        size={16}
                        className="text-muted-foreground shrink-0"
                      />
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-medium truncate">
                          {course.title}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {course.code}
                        </span>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={cn(
                        "capitalize shrink-0",
                        course.status === "active"
                          ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                          : course.status === "archived"
                            ? "bg-muted text-muted-foreground border-border"
                            : "bg-amber-500/10 text-amber-600 border-amber-500/20",
                      )}
                    >
                      {course.status}
                    </Badge>
                  </Link>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {classrooms && classrooms.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="size-4 text-muted-foreground" />
              {isInstructor ? "Teaching Classrooms" : "Joined Classrooms"}
            </CardTitle>
            <CardDescription>
              {isInstructor
                ? "Classrooms this teacher facilitates."
                : "Classrooms this student is a member of."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {classrooms.map((classroom) => (
                <li key={classroom.id}>
                  <Link
                    href={`/dashboard/classrooms/${classroom.id}`}
                    className="flex items-center justify-between gap-3 p-3 rounded-lg border bg-card text-card-foreground shadow-sm hover:border-primary/40 transition-colors"
                  >
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-medium truncate">
                        {classroom.name}
                      </span>
                      <span className="text-xs text-muted-foreground truncate">
                        {classroom.course?.title}
                        {classroom.section ? ` · ${classroom.section}` : ""}
                      </span>
                    </div>
                    <Badge
                      variant="outline"
                      className={cn(
                        "capitalize shrink-0",
                        classroom.status === "active"
                          ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                          : "bg-muted text-muted-foreground border-border",
                      )}
                    >
                      {classroom.status}
                    </Badge>
                  </Link>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {profile && profile.skills.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Skills & Interests</CardTitle>
            <CardDescription>
              Skills and areas this member has shared on their profile.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill) => (
                <Badge key={skill} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {profile && profile.achievements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="size-4 text-muted-foreground" />
              Achievements
            </CardTitle>
            <CardDescription>
              Milestones and awards this member has shared.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {profile.achievements.map((achievement, index) => (
                <div
                  key={achievement.id || index}
                  className="flex flex-col sm:flex-row gap-4 p-4 rounded-lg border bg-card text-card-foreground shadow-sm"
                >
                  <div className="min-w-[120px] text-sm text-muted-foreground flex flex-col gap-1 sm:border-r sm:pr-4">
                    <span className="font-medium text-foreground">
                      {achievement.issuer}
                    </span>
                    {achievement.date && (
                      <span className="text-xs">
                        {format(new Date(achievement.date), "MMM d, yyyy")}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <h4 className="font-semibold leading-none">
                      {achievement.title}
                    </h4>
                    {achievement.description && (
                      <p className="text-sm text-muted-foreground">
                        {achievement.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}