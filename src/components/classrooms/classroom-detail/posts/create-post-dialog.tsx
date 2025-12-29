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
}

export function CreatePostDialog({ classroomId }: CreatePostDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button size='sm'>
            <IconPlus className='mr-2 h-4 w-4' />
            Create Post
          </Button>
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
