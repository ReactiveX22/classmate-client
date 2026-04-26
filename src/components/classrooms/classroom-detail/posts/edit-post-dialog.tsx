'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { useEditPost } from '@/hooks/use-edit-post';
import { Post, SubmissionType } from '@/lib/api/services/post.service';
import { PostForm, PostFormData } from './post-form';

interface EditPostDialogProps {
  post: Post;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditPostDialog({
  post,
  open,
  onOpenChange,
}: EditPostDialogProps) {
  const { mutateAsync: updatePost, isPending } = useEditPost();

  const initialValues: PostFormData = {
    type: post.type,
    content: post.content,
    isPinned: !!post.isPinned,
    commentsEnabled: post.commentsEnabled ?? true,
    title: post.title || '',
    tags: post.tags || [],
    questionData:
      post.type === 'question'
        ? post.questionData?.mode === 'poll'
          ? {
              mode: 'poll',
              selectionMode: post.questionData.selectionMode,
              options: post.questionData.options.map((option) => ({
                id: option.id,
                text: option.text,
                position: option.position,
              })),
            }
          : {
              mode: 'short_answer',
            }
        : undefined,
    assignmentData:
      post.type === 'assignment'
        ? {
            dueDate: post.assignmentData?.dueDate
              ? new Date(post.assignmentData.dueDate)
              : undefined,
            points: post.assignmentData?.points ?? 100,
            submissionType:
              post.assignmentData?.submissionType ?? ('file' as SubmissionType),
            allowLateSubmission:
              post.assignmentData?.allowLateSubmission ?? true,
          }
        : undefined,
  } as PostFormData;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[600px]'>
        <DialogHeader>
          <DialogTitle>Edit Post</DialogTitle>
          <DialogDescription>Edit the post details below.</DialogDescription>
        </DialogHeader>
        <ScrollArea className='max-h-[75vh] pr-4'>
          <PostForm
            id='edit-post-form'
            showFooter={false}
            classroomId={post.classroomId}
            initialValues={initialValues}
            hideTypeSelection={true}
            lockQuestionPollStructure={
              post.questionData?.mode === 'poll' &&
              (post.questionData.votes?.length ?? 0) > 0
            }
            initialAttachments={post.attachments.map((att) => ({
              id: att.id,
              name: att.name,
              url: att.url,
              type: att.type,
              size: att.size || 0,
              mimeType: att.mimeType || '',
            }))}
            onSubmit={async (data) => {
              await updatePost({
                classroomId: post.classroomId,
                postId: post.id,
                data,
              });
              onOpenChange(false);
            }}
            isSubmitting={isPending}
            submitLabel='Save Changes'
          />
        </ScrollArea>
        <DialogFooter>
          <Button type='submit' form='edit-post-form' disabled={isPending}>
            {isPending ? 'Submitting...' : 'Submit'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
