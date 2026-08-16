import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { ClassroomWithCourse } from "@/lib/api/services/classroom.service";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { IconCalendar, IconChevronRight } from "@tabler/icons-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IconDotsVertical, IconShare } from "@tabler/icons-react";
import { RoleGuard } from "@/components/common/role-guard";
import { Role } from "@/types/auth";
import { useDeleteClassroom } from "@/hooks/use-classrooms";
import { DeleteConfirmDialog } from "@/components/common/delete-confirm-dialog";
import { ShareClassroomDialog } from "@/components/classrooms/share-classroom-dialog";
import { useState } from "react";
import { Trash } from "lucide-react";
import { ClassroomCardArt, colorPatterns } from "./classroom-card-art";
import { H3 } from "@/components/ui/typography";

interface ClassroomCardProps {
  data: ClassroomWithCourse;
  index?: number;
}

export function ClassroomCard({ data, index = 0 }: ClassroomCardProps) {
  const { classroom, course, teacher, upcoming } = data;
  const pattern = colorPatterns[index % colorPatterns.length];
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const deleteClassroomMutation = useDeleteClassroom();

  const handleDelete = () => {
    deleteClassroomMutation.mutate(classroom.id, {
      onSuccess: () => {
        setDeleteDialogOpen(false);
      },
    });
  };

  return (
    <Card className="pt-0 overflow-hidden border-none shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col group/card">
      <ClassroomCardArt pattern={pattern} code={course.code} />

      <CardContent className="flex-1 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-0.5 min-w-0 flex-1">
            <H3 className="truncate">{classroom.name}</H3>
            <p className="text-xs text-muted-foreground truncate">
              Section {classroom.section} • {course.credits} Credits •{" "}
              {classroom.classCode}
            </p>
          </div>

          <RoleGuard allowedRoles={[Role.Instructor]}>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground -mr-1"
                  >
                    <IconDotsVertical size={16} />
                  </Button>
                }
              />
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => setShareDialogOpen(true)}
                >
                  <IconShare size={16} className="mr-2" />
                  Share
                </DropdownMenuItem>
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => setDeleteDialogOpen(true)}
                >
                  <Trash size={16} className="mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </RoleGuard>
        </div>

        {classroom.description && (
          <p className="text-[13px] text-muted-foreground line-clamp-2 leading-relaxed">
            {classroom.description}
          </p>
        )}

        <div className="mt-auto pt-3 flex items-center justify-between gap-3 border-t border-dashed">
          <div className="flex items-center gap-2 min-w-0">
            <Avatar className="size-7 shrink-0">
              <AvatarImage src={teacher.image || undefined} />
              <AvatarFallback className="text-[11px] bg-primary/10 text-primary">
                {getInitials(teacher.name)}
              </AvatarFallback>
            </Avatar>
            <span className="text-[13px] font-medium truncate">
              {teacher.name}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {upcoming && upcoming.length > 0 && (
              <span
                className="flex items-center gap-1 text-xs font-medium text-primary"
                title="Upcoming Tasks"
              >
                <IconCalendar size={14} />
                <span className="tabular-nums leading-none">
                  {upcoming.length}
                </span>
              </span>
            )}
            <Button
              render={<Link href={`/dashboard/classrooms/${classroom.id}`} />}
              size="sm"
              variant="outline"
              nativeButton={false}
              className="h-8"
            >
              Open
              <IconChevronRight
                size={15}
                className="ml-0.5 group-hover/card:translate-x-0.5 transition-transform"
              />
            </Button>
          </div>
        </div>
      </CardContent>

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Classroom"
        description="Are you sure you want to delete this classroom? This action cannot be undone."
        onConfirm={handleDelete}
        isLoading={deleteClassroomMutation.isPending}
      />

      <ShareClassroomDialog
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
        classroom={{ name: classroom.name, classCode: classroom.classCode }}
      />
    </Card>
  );
}