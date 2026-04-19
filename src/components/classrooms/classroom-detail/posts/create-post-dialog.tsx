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
import { PostType } from '@/lib/api/services/post.service';

interface CreatePostDialogProps {
  classroomId: string;
  trigger?: React.ReactElement;
  defaultType?: PostType;
  hideTypeSelection?: boolean;
}

export function CreatePostDialog({
  classroomId,
  trigger,
  defaultType,
  hideTypeSelection,
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
          <DialogTitle>
            {defaultType ? `Create New ${defaultType.charAt(0).toUpperCase() + defaultType.slice(1)}` : 'Create New Post'}
          </DialogTitle>
          <DialogDescription>
            {defaultType === 'material' 
              ? 'Share learning materials and resources with your class.'
              : 'Share information, assignments, or questions with your class.'}
          </DialogDescription>
        </DialogHeader>

        <CreatePostForm
          classroomId={classroomId}
          defaultType={defaultType}
          hideTypeSelection={hideTypeSelection}
          onSuccess={() => {
            setOpen(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
