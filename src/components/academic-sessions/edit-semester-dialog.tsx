'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Semester } from '@/lib/api/services/semester.service';
import { EditSemesterForm } from './edit-semester-form';

interface EditSemesterDialogProps {
  semester: Semester;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditSemesterDialog({
  semester,
  open,
  onOpenChange,
}: EditSemesterDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='w-full max-w-[calc(100%-2rem)] max-h-[calc(100%-2rem)] sm:max-w-xl overflow-auto'>
        <DialogHeader>
          <DialogTitle>Edit Semester</DialogTitle>
          <DialogDescription>Update the semester ordinal.</DialogDescription>
        </DialogHeader>
        <EditSemesterForm semester={semester} onSuccess={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}
