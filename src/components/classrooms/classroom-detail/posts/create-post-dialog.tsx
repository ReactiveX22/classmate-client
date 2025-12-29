import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useCreatePost } from '@/hooks/use-create-post';
import {
  CreatePostDto,
  PostType,
  SubmissionType,
} from '@/lib/api/services/post.service';
import { IconPlus } from '@tabler/icons-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { CreatePostForm } from './create-post-form';

interface CreatePostDialogProps {
  classroomId: string;
}

export function CreatePostDialog({ classroomId }: CreatePostDialogProps) {
  const [open, setOpen] = useState(false);
  const { mutate: createPost, isPending } = useCreatePost();

  // Form State
  const [type, setType] = useState<PostType>('announcement');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [dueDate, setDueDate] = useState<Date>();
  const [points, setPoints] = useState<number>(100);
  const [submissionType, setSubmissionType] = useState<SubmissionType>('file');
  const [allowLateSubmission, setAllowLateSubmission] = useState(true);
  const [isPinned, setIsPinned] = useState(false);
  const [commentsEnabled, setCommentsEnabled] = useState(true);

  const resetForm = () => {
    setType('announcement');
    setTitle('');
    setContent('');
    setDueDate(undefined);
    setPoints(100);
    setSubmissionType('file');
    setAllowLateSubmission(true);
    setIsPinned(false);
    setCommentsEnabled(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      toast.error('Content is required');
      return;
    }

    if (type !== 'announcement' && type !== 'question' && !title.trim()) {
      toast.error('Title is required');
      return;
    }

    const payload: CreatePostDto = {
      classroomId,
      type,
      content,
      isPinned,
      commentsEnabled,
      // Only include title if it's not empty (backend handles null/undefined)
      title: title.trim() || undefined,
    };

    if (type === 'assignment') {
      payload.assignmentData = {
        dueDate: dueDate?.toISOString(),
        points,
        submissionType,
        allowLateSubmission,
      };
    }

    createPost(payload, {
      onSuccess: () => {
        setOpen(false);
        resetForm();
      },
    });
  };

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
            resetForm();
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
