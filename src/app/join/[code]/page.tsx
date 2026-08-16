"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useClassroomJoinPreview, useJoinClassroom } from "@/hooks/use-classrooms";
import { useIsAuthenticated, useUser } from "@/hooks/useAuth";
import { Role } from "@/types/auth";
import { ApiError } from "@/types/errors";
import {
  IconCircleCheck,
  IconCircleX,
  IconSchool,
  IconUsers,
} from "@tabler/icons-react";
import { AxiosError } from "axios";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function JoinClassroomPage() {
  const params = useParams<{ code: string }>();
  const router = useRouter();
  const code = params.code;

  const { isAuthenticated, isLoading: isAuthLoading } = useIsAuthenticated();
  const { data: user } = useUser();
  const previewQuery = useClassroomJoinPreview(code, isAuthenticated);
  const joinMutation = useJoinClassroom();
  const [joinedClassroomId, setJoinedClassroomId] = useState<string | null>(
    null,
  );

  const isStudent = user?.role === Role.Student;
  const classroom = previewQuery.data;
  const isJoined = joinedClassroomId !== null;

  const isResolved =
    isJoined ||
    (!isAuthLoading &&
      isAuthenticated &&
      !previewQuery.isLoading &&
      (previewQuery.isError ||
        !classroom ||
        classroom.status === "inactive" ||
        classroom.isMember));

  const handleJoin = () => {
    joinMutation.mutate(code, {
      onSuccess: (result) => setJoinedClassroomId(result.classroomId),
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md flex flex-col gap-6">
        <Link
          href="/"
          className="self-center flex items-center gap-2 font-bold text-xl text-muted-foreground hover:text-foreground transition-colors"
        >
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground">
            <IconSchool size={20} />
          </div>
          <span>ClassMate</span>
        </Link>

        <Card className="w-full shadow-lg">
          {!isResolved && (
            <CardHeader>
              <CardTitle className="text-2xl">Join a class</CardTitle>
              <CardDescription>
                Use the link your teacher shared to join their classroom.
              </CardDescription>
            </CardHeader>
          )}
          <CardContent>
            {isAuthLoading ? (
              <div className="flex flex-col gap-3">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-10 w-full mt-2" />
              </div>
            ) : !isAuthenticated ? (
              <div className="flex flex-col gap-4">
                <p className="text-sm text-muted-foreground">
                  Log in to your ClassMate account to view and join this class.
                </p>
                <Link
                  href={`/login?redirect=/join/${code}`}
                  className={buttonVariants({ className: "w-full" })}
                >
                  Log in to join
                </Link>
              </div>
            ) : isJoined ? (
              <SuccessView
                title="You've joined this class!"
                description={
                  classroom
                    ? `You're now a member of ${classroom.name}.`
                    : "You're now a member of this class."
                }
                classroomLink={`/dashboard/classrooms/${joinedClassroomId}`}
                onDashboard={() => router.push("/dashboard")}
              />
            ) : previewQuery.isLoading ? (
              <div className="flex flex-col gap-3">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-10 w-full mt-2" />
              </div>
            ) : previewQuery.isError || !classroom ? (
              <ProblemView
                title="Class not found"
                description={
                  isNotFoundError(previewQuery.error)
                    ? "This class isn't available at your institution."
                    : "Something went wrong loading this class. Please try again."
                }
                onDashboard={() => router.push("/dashboard")}
              />
            ) : classroom.status === "inactive" ? (
              <ProblemView
                title="Class is inactive"
                description="This class is no longer active."
                onDashboard={() => router.push("/dashboard")}
              />
            ) : classroom.isMember ? (
              <SuccessView
                title="You're already in this class"
                description={`${classroom.name}${
                  classroom.section
                    ? ` • Section ${classroom.section}`
                    : ""
                }`}
                classroomLink={`/dashboard/classrooms/${classroom.id}`}
                onDashboard={() => router.push("/dashboard")}
              />
            ) : isStudent ? (
              <div className="flex flex-col gap-5">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    You&apos;re joining
                  </p>
                  <h3 className="text-xl font-semibold truncate">
                    {classroom.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {classroom.section
                      ? `Section ${classroom.section}`
                      : "No section"}{" "}
                    •{" "}
                    <span className="inline-flex items-center gap-1">
                      <IconUsers size={14} className="inline" />
                      {classroom.teacherName ?? "Your teacher"}
                    </span>
                  </p>
                </div>

                <Button
                  type="button"
                  className="w-full"
                  disabled={joinMutation.isPending}
                  onClick={handleJoin}
                >
                  {joinMutation.isPending ? "Joining..." : "Join class"}
                </Button>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Only students can join a class using a link.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ProblemView({
  title,
  description,
  onDashboard,
}: {
  title: string;
  description: string;
  onDashboard: () => void;
}) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col items-center text-center gap-2">
        <div className="w-14 h-14 rounded-full bg-destructive/10 border border-destructive/20 flex items-center justify-center">
          <IconCircleX size={28} className="text-destructive" />
        </div>
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={onDashboard}
      >
        Go to dashboard
      </Button>
    </div>
  );
}

function SuccessView({
  title,
  description,
  classroomLink,
  onDashboard,
}: {
  title: string;
  description: string;
  classroomLink: string;
  onDashboard: () => void;
}) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col items-center text-center gap-2">
        <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
          <IconCircleCheck size={28} className="text-emerald-600" />
        </div>
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="flex flex-col gap-2">
        <Link
          href={classroomLink}
          className={buttonVariants({ className: "w-full" })}
        >
          Go to class
        </Link>
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={onDashboard}
        >
          Go to dashboard
        </Button>
      </div>
    </div>
  );
}

function isNotFoundError(error: unknown) {
  if (error instanceof AxiosError) {
    return error.response?.status === 404;
  }
  return (error as ApiError | undefined)?.errorCode === "RESOURCE_NOT_FOUND";
}