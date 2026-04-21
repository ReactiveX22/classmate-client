'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AddCourseSessionForm } from './add-course-session-form';

interface AddCourseSessionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddCourseSessionDialog({
  open,
  onOpenChange,
}: AddCourseSessionDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='w-full max-w-[calc(100%-2rem)] max-h-[calc(100%-2rem)] sm:max-w-xl overflow-auto'>
        <DialogHeader>
          <DialogTitle>Add Course Session</DialogTitle>
          <DialogDescription>Create a new academic session.</DialogDescription>
        </DialogHeader>
        <AddCourseSessionForm onSuccess={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}
