'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
    isPinned: post.isPinned,
    commentsEnabled: post.commentsEnabled,
    title: post.title || undefined,
    assignmentData: post.assignmentData
      ? {
          dueDate: post.assignmentData.dueDate
            ? new Date(post.assignmentData.dueDate)
            : undefined,
          points: post.assignmentData.points || 100,
          submissionType:
            post.assignmentData.submissionType || ('file' as SubmissionType),
          allowLateSubmission: post.assignmentData.allowLateSubmission ?? true,
        }
      : undefined,
  } as PostFormData;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[600px] max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Edit Post</DialogTitle>
          <DialogDescription>Edit the post details below.</DialogDescription>
        </DialogHeader>
        <PostForm
          classroomId={post.classroomId}
          initialValues={initialValues}
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
      </DialogContent>
    </Dialog>
  );
}
