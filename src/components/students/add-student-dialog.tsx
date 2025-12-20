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
import { useState } from 'react';
import { AddStudentForm } from './add-student-form';
import { IconUserPlus } from '@tabler/icons-react';

export function AddStudentDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button>
            <IconUserPlus className='mr-2 h-4 w-4' />
            Add Student
          </Button>
        }
      />
      <DialogContent className='w-full max-w-[calc(100%-2rem)] max-h-[calc(100%-2rem)] sm:max-w-md overflow-auto'>
        <DialogHeader>
          <DialogTitle>Add New Student</DialogTitle>
          <DialogDescription>
            Create a new student account. Fill in the details below.
          </DialogDescription>
        </DialogHeader>
        <AddStudentForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
