'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { TeacherData } from '@/lib/api/services/teacher.service';
import { EditTeacherForm } from './edit-teacher-form';

interface EditTeacherDialogProps {
  teacher: TeacherData;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditTeacherDialog({
  teacher,
  open,
  onOpenChange,
}: EditTeacherDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='w-full max-w-[calc(100%-2rem)] max-h-[calc(100%-2rem)] sm:max-w-md overflow-auto'>
        <DialogHeader>
          <DialogTitle>Edit Teacher</DialogTitle>
          <DialogDescription>Update teacher account details.</DialogDescription>
        </DialogHeader>
        <EditTeacherForm
          teacher={teacher}
          onSuccess={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
