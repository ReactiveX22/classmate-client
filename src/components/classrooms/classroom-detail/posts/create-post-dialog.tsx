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
import { CreatePostForm } from './create-post-form';

interface CreatePostDialogProps {
  classroomId: string;
  trigger?: React.ReactElement;
}

export function CreatePostDialog({
  classroomId,
  trigger,
}: CreatePostDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          trigger || (
            <Button size='sm' className='sm:px-3'>
              <IconPlus className='h-4 w-4 sm:mr-2' />
              <span className='hidden sm:inline'>Create Post</span>
            </Button>
          )
        }
      />
      <DialogContent className='sm:max-w-[600px] max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Create New Post</DialogTitle>
          <DialogDescription>
            Share information, assignments, or questions with your class.
          </DialogDescription>
        </DialogHeader>

        <CreatePostForm
          classroomId={classroomId}
          onSuccess={() => {
            setOpen(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
