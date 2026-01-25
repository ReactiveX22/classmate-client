import { DeleteConfirmDialog } from '@/components/common/delete-confirm-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useDeletePost } from '@/hooks/use-delete-post';
import { Post } from '@/lib/api/services/post.service';
import { getInitials } from '@/lib/utils';
import { IconPin } from '@tabler/icons-react';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { useState } from 'react';
import { AttachmentDisplay } from './attachment-display';
import { PostCardActions } from './post-card-actions';

interface AnnouncementCardProps {
  post: Post;
}

import { EditPostDialog } from '../edit-post-dialog';

export function AnnouncementCard({ post }: AnnouncementCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const deletePost = useDeletePost();

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
      <Card className='overflow-hidden hover:shadow-md transition-shadow'>
        <CardHeader>
          <div className='flex items-start gap-3'>
            <Avatar>
              <AvatarImage src={post.author?.image || undefined} />
              <AvatarFallback>{getInitials(post.author?.name)}</AvatarFallback>
            </Avatar>
            <div className='flex-1 min-w-0'>
              <div className='flex items-center gap-2 flex-wrap'>
                <p className='font-medium text-sm'>
                  {post.author?.name || 'Unknown'}
                </p>
                {post.isPinned && (
                  <IconPin size={16} className='text-muted-foreground' />
                )}
              </div>
              <p className='text-xs text-muted-foreground'>
                {formatDistanceToNow(parseISO(post.createdAt), {
                  addSuffix: true,
                })}
              </p>
            </div>
          </div>
          <PostCardActions
            authorId={post.authorId}
            onEdit={() => setShowEditDialog(true)}
            onDelete={() => setShowDeleteDialog(true)}
          />
        </CardHeader>

        <CardContent className='space-y-4 pt-0'>
          <p className='text-sm text-foreground whitespace-pre-wrap leading-relaxed'>
            {post.content}
          </p>

          {post.attachments && post.attachments.length > 0 && (
            <AttachmentDisplay attachments={post.attachments} />
          )}
        </CardContent>
      </Card>

      <DeleteConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title='Delete Announcement'
        description='Are you sure you want to delete this announcement? This action cannot be undone.'
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
