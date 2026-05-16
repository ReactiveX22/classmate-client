"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AddSemesterForm } from "./add-semester-form";

interface AddSemesterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddSemesterDialog({
  open,
  onOpenChange,
}: AddSemesterDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-[calc(100%-2rem)] max-h-[calc(100%-2rem)] sm:max-w-xl overflow-auto">
        <DialogHeader>
          <DialogTitle>Add Semester</DialogTitle>
          <DialogDescription>Create a new semester.</DialogDescription>
        </DialogHeader>
        <AddSemesterForm onSuccess={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}
