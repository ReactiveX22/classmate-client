"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TeacherSelect } from "./teacher-select";
import { toast } from "sonner";
import { useUpdateCourse } from "@/hooks/use-courses";

interface AssignTeacherDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  courseTitle: string;
  currentTeacherId?: string;
}

export function AssignTeacherDialog({
  open,
  onOpenChange,
  courseTitle,
  currentTeacherId,
}: AssignTeacherDialogProps) {
  const { id: courseId } = useParams();
  const [teacherId, setTeacherId] = React.useState<string | undefined>(
    currentTeacherId,
  );
  const updateMutation = useUpdateCourse();

  // Reset teacherId when dialog opens or currentTeacherId changes
  React.useEffect(() => {
    if (open) {
      setTeacherId(currentTeacherId);
    }
  }, [open, currentTeacherId]);

  const handleAssign = () => {
    if (!teacherId) {
      toast.error("Please select a teacher");
      return;
    }

    updateMutation.mutate(
      {
        id: courseId as string,
        data: { teacherId },
      },
      {
        onSuccess: () => {
          onOpenChange(false);
          toast.success(
            currentTeacherId
              ? "Instructor updated successfully"
              : "Teacher assigned successfully",
          );
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] overflow-visible">
        <DialogHeader>
          <DialogTitle>
            {currentTeacherId ? "Change Instructor" : "Assign Teacher"}
          </DialogTitle>
          <DialogDescription>
            {currentTeacherId ? (
              <>
                Choose a new instructor for <strong>{courseTitle}</strong>.
              </>
            ) : (
              <>
                Select a teacher to assign to <strong>{courseTitle}</strong>.
              </>
            )}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <TeacherSelect
            value={teacherId}
            onValueChange={setTeacherId}
            currentTeacherId={currentTeacherId}
          />
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={updateMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAssign}
            disabled={
              updateMutation.isPending ||
              !teacherId ||
              teacherId === currentTeacherId
            }
          >
            {updateMutation.isPending
              ? "Saving..."
              : currentTeacherId
                ? "Update Instructor"
                : "Assign"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
