'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Course } from '@/lib/api/services/course.service';
import { EditCourseForm } from './edit-course-form';

interface EditCourseDialogProps {
  course: Course;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditCourseDialog({
  course,
  open,
  onOpenChange,
}: EditCourseDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='w-full max-w-[calc(100%-2rem)] max-h-[calc(100%-2rem)] sm:max-w-xl overflow-auto'>
        <DialogHeader>
          <DialogTitle>Edit Course</DialogTitle>
          <DialogDescription>Update course details.</DialogDescription>
        </DialogHeader>
        <EditCourseForm course={course} onSuccess={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}
