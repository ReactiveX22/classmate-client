'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CourseSession } from '@/lib/api/services/course-session.service';
import { EditCourseSessionForm } from './edit-course-session-form';

interface EditCourseSessionDialogProps {
  session: CourseSession;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditCourseSessionDialog({
  session,
  open,
  onOpenChange,
}: EditCourseSessionDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='w-full max-w-[calc(100%-2rem)] max-h-[calc(100%-2rem)] sm:max-w-xl overflow-auto'>
        <DialogHeader>
          <DialogTitle>Edit Course Session</DialogTitle>
          <DialogDescription>Update the details of the academic session.</DialogDescription>
        </DialogHeader>
        <EditCourseSessionForm session={session} onSuccess={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}
