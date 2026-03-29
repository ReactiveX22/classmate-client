'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useCreateNotice } from '@/hooks/use-notices';
import { NoticeForm, NoticeFormValues } from './notice-form';

export function AddNoticeDialog() {
  const [open, setOpen] = useState(false);
  const { mutateAsync: createNotice, isPending } = useCreateNotice();

  const onSubmit = async (values: NoticeFormValues) => {
    try {
      await createNotice(values);
      setOpen(false);
      toast.success('Notice created successfully');
    } catch (error) {
      toast.error('Failed to create notice');
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button>
            <Plus className='mr-2 h-4 w-4' />
            Publish Notice
          </Button>
        }
      ></DialogTrigger>
      <DialogContent className='sm:max-w-[600px] lg:max-w-[800px] max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Create Notice</DialogTitle>
          <DialogDescription>
            Create a new notice for your organization.
          </DialogDescription>
        </DialogHeader>
        <NoticeForm
          onSubmit={onSubmit}
          isSubmitting={isPending}
          submitLabel='Create Notice'
        />
      </DialogContent>
    </Dialog>
  );
}
