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
import { useDeleteTeacher } from '@/hooks/use-teachers';
import { TeacherData } from '@/lib/api/services/teacher.service';
import { toast } from 'sonner';

interface DeleteTeacherDialogProps {
  teacher: TeacherData;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteTeacherDialog({
  teacher,
  open,
  onOpenChange,
}: DeleteTeacherDialogProps) {
  const deleteTeacherMutation = useDeleteTeacher();

  const handleDelete = () => {
    deleteTeacherMutation.mutate(teacher.teacher.id, {
      onSuccess: () => {
        toast.success('Teacher deleted successfully');
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
            teacher account for <strong>{teacher.user.name}</strong> and remove
            their data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteTeacherMutation.isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
            disabled={deleteTeacherMutation.isPending}
          >
            {deleteTeacherMutation.isPending ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
