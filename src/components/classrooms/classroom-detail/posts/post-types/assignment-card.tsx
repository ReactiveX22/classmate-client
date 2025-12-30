import { DeleteConfirmDialog } from '@/components/common/delete-confirm-dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useDeletePost } from '@/hooks/use-delete-post';
import { Post } from '@/lib/api/services/post.service';
import { IconCalendar, IconClipboard, IconPin } from '@tabler/icons-react';
import { format, formatDistanceToNow } from 'date-fns';
import { useState } from 'react';
import { AttachmentDisplay } from './attachment-display';
import { EditPostDialog } from '../edit-post-dialog';
import { PostCardActions } from './post-card-actions';

import { useRouter } from 'next/navigation';

interface AssignmentCardProps {
  post: Post;
}

export function AssignmentCard({ post }: AssignmentCardProps) {
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const deletePost = useDeletePost();

  const handleNavigate = () => {
    router.push(
      `/dashboard/classrooms/${post.classroomId}/assignments/${post.id}`
    );
  };

  const handleDelete = () => {
    deletePost.mutate(
      {
        classroomId: post.classroomId,
        postId: post.id,
      },
      {
        onSuccess: () => {
          setShowDeleteDialog(false);
        },
      }
    );
  };

  return (
    <>
      <Card
        className='overflow-hidden hover:shadow-md transition-shadow cursor-pointer'
        onClick={handleNavigate}
      >
        <CardHeader>
          <div className='flex items-start gap-4'>
            <div className='p-3 bg-blue-500/10 rounded-full'>
              <IconClipboard size={20} className='text-blue-600' />
            </div>
            <div className='flex-1 min-w-0 space-y-2'>
              <div className='flex items-start justify-between gap-4'>
                <div className='flex-1'>
                  <div className='flex items-center gap-2 flex-wrap mb-1'>
                    <h3 className='font-medium text-sm'>{post.title}</h3>
                    {post.isPinned && (
                      <IconPin size={16} className='text-muted-foreground' />
                    )}
                  </div>
                  <p className='text-xs text-muted-foreground'>
                    Posted by {post.author?.name || 'Unknown'} •{' '}
                    {formatDistanceToNow(new Date(post.createdAt), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
                {post.assignmentData?.points && (
                  <Badge
                    variant='outline'
                    className='bg-blue-500/5 border-blue-200 text-blue-700'
                  >
                    {post.assignmentData.points} pts
                  </Badge>
                )}
              </div>

              {post.assignmentData?.dueDate && (
                <div className='flex items-center gap-1.5 text-xs'>
                  <IconCalendar className='size-4 text-muted-foreground' />
                  <span className='font-medium'>
                    Due {format(new Date(post.assignmentData.dueDate), 'PPp')}
                  </span>
                </div>
              )}
            </div>
          </div>
          <div onClick={(e) => e.stopPropagation()}>
            <PostCardActions
              authorId={post.authorId}
              onEdit={() => setShowEditDialog(true)}
              onDelete={() => setShowDeleteDialog(true)}
            />
          </div>
        </CardHeader>

        <CardContent className='pt-0'>
          {post.content && (
            <p className='text-sm text-foreground mb-4 whitespace-pre-wrap leading-relaxed'>
              {post.content}
            </p>
          )}

          {post.attachments && post.attachments.length > 0 && (
            <AttachmentDisplay
              attachments={post.attachments}
              variant='compact'
            />
          )}
        </CardContent>
      </Card>

      <DeleteConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title='Delete Assignment'
        description='Are you sure you want to delete this assignment? This action cannot be undone.'
        onConfirm={handleDelete}
        confirmText='Delete'
        isLoading={deletePost.isPending}
      />

      <EditPostDialog
        post={post}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
      />
    </>
  );
}
