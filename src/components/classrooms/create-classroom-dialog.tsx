'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { IconPlus } from '@tabler/icons-react';
import { useState } from 'react';
import { CreateClassroomForm } from './create-classroom-form';

export function CreateClassroomDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button className='gap-2 shadow-sm'>
            <IconPlus size={18} />
            Create Classroom
          </Button>
        }
      />
      <DialogContent className='w-full max-w-[calc(100%-2rem)] max-h-[calc(100%-2rem)] sm:max-w-md overflow-auto'>
        <DialogHeader>
          <DialogTitle>Create New Classroom</DialogTitle>
          <DialogDescription>
            Enter the details for your new classroom below.
          </DialogDescription>
        </DialogHeader>
        <CreateClassroomForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
