'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ClassroomDetail } from '@/lib/api/services/classroom.service';
import { UpdateClassroomForm } from './update-classroom-form';

interface UpdateClassroomDialogProps {
  classroom: ClassroomDetail;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UpdateClassroomDialog({
  classroom,
  open,
  onOpenChange,
}: UpdateClassroomDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Classroom</DialogTitle>
        </DialogHeader>
        <UpdateClassroomForm
          classroom={classroom}
          onSuccess={() => onOpenChange(false)}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
