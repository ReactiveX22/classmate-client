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
import { AddTeacherForm } from './add-teacher-form';

export function AddTeacherDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button>
            <IconPlus className='mr-2 h-4 w-4' />
            Add Teacher
          </Button>
        }
      />
      <DialogContent className='w-full max-w-[calc(100%-2rem)] max-h-[calc(100%-2rem)] sm:max-w-md overflow-auto'>
        <DialogHeader>
          <DialogTitle>Add New Teacher</DialogTitle>
          <DialogDescription>
            Create a new teacher account. Fill in the details below.
          </DialogDescription>
        </DialogHeader>
        <AddTeacherForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
