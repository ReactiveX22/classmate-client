"use client";

import { RoleGuard } from "@/components/common/role-guard";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { usePosts } from "@/hooks/use-posts";
import { Role } from "@/types/auth";
import { IconClipboardList, IconLoader2 } from "@tabler/icons-react";
import { useMemo } from "react";
import { CreatePostDialog } from "./posts/create-post-dialog";
import { AssignmentCard } from "./posts/post-types/assignment-card";

interface ClassworkTabProps {
  classroomId: string;
  isTeacher?: boolean;
}

export function ClassworkTab({ classroomId, isTeacher }: ClassworkTabProps) {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    usePosts(classroomId, { limit: 20 });

  const assignments = useMemo(() => {
    if (!data) return [];
    return data.pages
      .flatMap((page) => page.data)
      .filter((post) => post.type === "assignment");
  }, [data]);

  const isEmpty = !isLoading && assignments.length === 0;

  return (
    <div className="max-w-2xl mt-6 mx-auto space-y-4 pb-12 sm:pb-20">
      <RoleGuard allowedRoles={[Role.Instructor]}>
        <Card className="py-2 mb-4">
          <CardHeader className="py-1 items-center">
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-primary/10 text-primary p-2 sm:p-3 shrink-0">
                <IconClipboardList className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="flex flex-col">
                <h3 className="font-medium text-sm">
                  Assign work to your class
                </h3>
                <p className="text-xs text-muted-foreground">
                  Create assignments, quizzes, and materials
                </p>
              </div>
            </div>

            <CardAction className="my-auto">
              <CreatePostDialog classroomId={classroomId} />
            </CardAction>
          </CardHeader>
        </Card>
      </RoleGuard>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <IconLoader2 className="animate-spin text-muted-foreground" />
        </div>
      ) : isEmpty ? (
        <Card className="border-dashed shadow-none bg-muted/30">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="p-4 bg-background rounded-full mb-4 shadow-sm">
              <IconClipboardList className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-1">No assignments yet</h3>
            <p className="text-muted-foreground text-sm max-w-sm mx-auto mb-6">
              Assignments you create will appear here. Students can view details
              and submit their work.
            </p>
            <CreatePostDialog
              classroomId={classroomId}
              trigger={<Button variant="outline">Create assignment</Button>}
            />
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {assignments.map((post) => (
            <AssignmentCard key={post.id} post={post} isTeacher={isTeacher} />
          ))}

          {hasNextPage && (
            <div className="flex justify-center pt-6">
              <Button
                variant="ghost"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
              >
                {isFetchingNextPage ? (
                  <>
                    <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  "Load more"
                )}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
