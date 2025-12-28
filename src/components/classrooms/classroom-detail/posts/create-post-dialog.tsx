import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { IconCalendar, IconPaperclip, IconPlus } from '@tabler/icons-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import {
  CreatePostDto,
  PostType,
  SubmissionType,
} from '@/lib/api/services/post.service';
import { useCreatePost } from '@/hooks/use-create-post';
import { toast } from 'sonner';

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

        <form onSubmit={handleSubmit} className='space-y-6 py-4'>
          <div className='grid gap-4'>
            <div className='grid gap-2'>
              <Label htmlFor='type'>Post Type</Label>
              <Select
                value={type}
                onValueChange={(value) => setType(value as PostType)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='announcement'>Announcement</SelectItem>
                  <SelectItem value='assignment'>Assignment</SelectItem>
                  <SelectItem value='material'>Material</SelectItem>
                  <SelectItem value='question'>Question</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {(type === 'assignment' || type === 'material') && (
              <div className='grid gap-2'>
                <Label htmlFor='title'>Title</Label>
                <Input
                  id='title'
                  placeholder='Enter title'
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
            )}

            <div className='grid gap-2'>
              <Label htmlFor='content'>Content</Label>
              <Textarea
                id='content'
                placeholder={
                  type === 'question'
                    ? 'Ask a question...'
                    : 'Share something with your class...'
                }
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className='min-h-[100px]'
                required
              />
            </div>

            {type === 'assignment' && (
              <div className='space-y-4 border rounded-lg p-4 bg-muted/20'>
                <h4 className='font-medium text-sm'>Assignment Details</h4>

                <div className='grid grid-cols-2 gap-4'>
                  <div className='grid gap-2'>
                    <Label>Due Date</Label>
                    <Popover>
                      <PopoverTrigger
                        render={
                          <Button
                            variant='outline'
                            className={cn(
                              'w-full justify-start text-left font-normal',
                              !dueDate && 'text-muted-foreground'
                            )}
                          >
                            <IconCalendar className='mr-2 h-4 w-4' />
                            {dueDate ? (
                              format(dueDate, 'PPP')
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        }
                      />
                      <PopoverContent className='w-auto p-0' align='start'>
                        <Calendar
                          mode='single'
                          selected={dueDate}
                          onSelect={setDueDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className='grid gap-2'>
                    <Label htmlFor='points'>Points</Label>
                    <Input
                      id='points'
                      type='number'
                      min='0'
                      max='1000'
                      value={points}
                      onChange={(e) => setPoints(Number(e.target.value))}
                    />
                  </div>
                </div>

                <div className='grid gap-2'>
                  <Label htmlFor='submissionType'>Submission Type</Label>
                  <Select
                    value={submissionType}
                    onValueChange={(value) =>
                      setSubmissionType(value as SubmissionType)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='file'>File Upload</SelectItem>
                      <SelectItem value='text'>Text Entry</SelectItem>
                      <SelectItem value='link'>Website URL</SelectItem>
                      <SelectItem value='multiple'>Multiple Options</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className='flex items-center space-x-2'>
                  <Checkbox
                    id='late-submission'
                    checked={allowLateSubmission}
                    onCheckedChange={(checked) =>
                      setAllowLateSubmission(!!checked)
                    }
                  />
                  <Label
                    htmlFor='late-submission'
                    className='font-normal text-sm text-muted-foreground'
                  >
                    Allow late submissions
                  </Label>
                </div>
              </div>
            )}

            {/* Placeholder Attachment UI */}
            <div className='grid gap-2'>
              <Label className='text-muted-foreground'>Attachments</Label>
              <div className='border border-dashed rounded-lg p-4 flex flex-col items-center justify-center text-muted-foreground bg-muted/10'>
                <IconPaperclip className='h-8 w-8 mb-2 opacity-50' />
                <p className='text-sm'>Attachment uploads coming soon</p>
              </div>
            </div>

            <div className='flex flex-col gap-3 pt-2'>
              <div className='flex items-center space-x-2'>
                <Checkbox
                  id='pinned'
                  checked={isPinned}
                  onCheckedChange={(checked) => setIsPinned(!!checked)}
                />
                <Label htmlFor='pinned' className='font-medium'>
                  Pin to top of stream
                </Label>
              </div>

              <div className='flex items-center space-x-2'>
                <Checkbox
                  id='comments'
                  checked={commentsEnabled}
                  onCheckedChange={(checked) => setCommentsEnabled(!!checked)}
                />
                <Label htmlFor='comments' className='font-medium'>
                  Enable comments
                </Label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type='button'
              variant='outline'
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type='submit' disabled={isPending}>
              {isPending ? 'Creating...' : 'Post'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
