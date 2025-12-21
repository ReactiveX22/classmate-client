'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { TeacherSelect } from './teacher-select';
import { toast } from 'sonner';
import { useUpdateCourse } from '@/hooks/use-courses';

interface AssignTeacherDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  courseTitle: string;
}

export function AssignTeacherDialog({
  open,
  onOpenChange,
  courseTitle,
}: AssignTeacherDialogProps) {
  const { id: courseId } = useParams();
  const [teacherId, setTeacherId] = React.useState<string | undefined>();
  const updateMutation = useUpdateCourse();

  const handleAssign = () => {
    if (!teacherId) {
      toast.error('Please select a teacher');
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
          toast.success('Teacher assigned successfully');
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[425px] overflow-visible'>
        <DialogHeader>
          <DialogTitle>Assign Teacher</DialogTitle>
          <DialogDescription>
            Select a teacher to assign to <strong>{courseTitle}</strong>.
          </DialogDescription>
        </DialogHeader>
        <div className='py-4'>
          <TeacherSelect value={teacherId} onValueChange={setTeacherId} />
        </div>
        <DialogFooter>
          <Button
            variant='outline'
            onClick={() => onOpenChange(false)}
            disabled={updateMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAssign}
            disabled={updateMutation.isPending || !teacherId}
          >
            {updateMutation.isPending ? 'Assigning...' : 'Assign'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
