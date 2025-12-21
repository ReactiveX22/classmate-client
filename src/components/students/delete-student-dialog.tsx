'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useDeleteStudent } from '@/hooks/use-students';
import { StudentData } from '@/lib/api/services/student.service';
import { toast } from 'sonner';

interface DeleteStudentDialogProps {
  student: StudentData;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteStudentDialog({
  student,
  open,
  onOpenChange,
}: DeleteStudentDialogProps) {
  const deleteStudentMutation = useDeleteStudent();

  const handleDelete = () => {
    // Assuming student.student.id is the ID we need to delete.
    if (!student.student?.id) return;

    deleteStudentMutation.mutate(student.student.id, {
      onSuccess: () => {
        toast.success('Student deleted successfully');
        onOpenChange(false);
      },
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            student account for <strong>{student.user.name}</strong> and remove
            their data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteStudentMutation.isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            variant='destructive'
            disabled={deleteStudentMutation.isPending}
          >
            {deleteStudentMutation.isPending ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
