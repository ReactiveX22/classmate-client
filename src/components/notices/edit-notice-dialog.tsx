'use client';

import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useUpdateNotice } from '@/hooks/use-notices';
import { NoticeForm, NoticeFormValues } from './notice-form';
import { Notice } from '@/lib/api/services/notice.service';

interface EditNoticeDialogProps {
  notice: Notice;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditNoticeDialog({
  notice,
  open,
  onOpenChange,
}: EditNoticeDialogProps) {
  const { mutateAsync: updateNotice, isPending } = useUpdateNotice();

  const onSubmit = async (values: NoticeFormValues) => {
    try {
      await updateNotice({ id: notice.id, data: values });
      onOpenChange(false);
      toast.success('Notice updated successfully');
    } catch (error) {
      toast.error('Failed to update notice');
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[525px]'>
        <DialogHeader>
          <DialogTitle>Edit Notice</DialogTitle>
          <DialogDescription>
            Make changes to the notice here.
          </DialogDescription>
        </DialogHeader>
        <NoticeForm
          initialData={notice}
          onSubmit={onSubmit}
          isSubmitting={isPending}
        />
      </DialogContent>
    </Dialog>
  );
}
