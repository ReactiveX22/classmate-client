import { DeleteConfirmDialog } from '@/components/common/delete-confirm-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useDeletePost } from '@/hooks/use-delete-post';
import { useTogglePostBookmark } from '@/hooks/use-toggle-post-bookmark';
import { Post } from '@/lib/api/services/post.service';
import { IconBook, IconBookmark, IconPin } from '@tabler/icons-react';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import { useState } from 'react';
import { EditPostDialog } from '../edit-post-dialog';
import { CommentSection } from '../comment-section';
import { AttachmentDisplay } from './attachment-display';
import { PostCardActions } from './post-card-actions';

interface MaterialCardProps {
  post: Post;
  resourceHref?: string;
}

export function MaterialCard({ post, resourceHref }: MaterialCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const deletePost = useDeletePost();
  const toggleBookmark = useTogglePostBookmark();

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
      },
    );
  };

  return (
    <>
      <Card className='overflow-hidden hover:shadow-md transition-shadow'>
        <CardHeader>
          <div className='flex items-start gap-2.5 sm:gap-3'>
            <div className='p-2 sm:p-2.5 bg-green-500/10 rounded-full shrink-0'>
              <IconBook className='w-4 h-4 sm:w-5 sm:h-5 text-green-600' />
            </div>
            <div className='flex-1 min-w-0'>
              <div className='flex items-center gap-2 flex-wrap mb-1'>
                <h3 className='font-medium text-sm'>
                  {resourceHref ? (
                    <Link
                      href={resourceHref}
                      className='hover:underline underline-offset-4'
                    >
                      {post.title || 'Class Material'}
                    </Link>
                  ) : (
                    post.title || 'Class Material'
                  )}
                </h3>
                {post.isPinned && (
                  <Badge variant='secondary' className='gap-1 h-5'>
                    <IconPin size={12} />
                  </Badge>
                )}
              </div>
              <p className='text-xs text-muted-foreground'>
                {post.author?.name || 'Unknown'} •{' '}
                {formatDistanceToNow(new Date(post.createdAt), {
                  addSuffix: true,
                })}
              </p>
            </div>
            <Button
              variant='ghost'
              size='icon'
              className='h-8 w-8'
              aria-label={
                post.isBookmarked ? 'Remove bookmark' : 'Add bookmark'
              }
              onClick={() =>
                toggleBookmark.mutate({
                  classroomId: post.classroomId,
                  postId: post.id,
                  bookmarked: !!post.isBookmarked,
                })
              }
              disabled={toggleBookmark.isPending}
            >
              <IconBookmark
                size={18}
                className={
                  post.isBookmarked
                    ? 'fill-current text-primary'
                    : 'text-muted-foreground'
                }
              />
            </Button>
          </div>
          <PostCardActions
            authorId={post.authorId}
            onEdit={() => setShowEditDialog(true)}
            onDelete={() => setShowDeleteDialog(true)}
          />
        </CardHeader>

        <CardContent className='space-y-4'>
          {post.tags && post.tags.length > 0 && (
            <div className='flex flex-wrap gap-2'>
              {post.tags.map((tag) => (
                <Badge key={tag} variant='secondary' className='text-xs'>
                  #{tag}
                </Badge>
              ))}
            </div>
          )}

          {post.content && (
            resourceHref ? (
              <Link href={resourceHref} className='block hover:opacity-90'>
                <p className='text-sm whitespace-pre-wrap leading-relaxed'>
                  {post.content}
                </p>
              </Link>
            ) : (
              <p className='text-sm whitespace-pre-wrap leading-relaxed'>
                {post.content}
              </p>
            )
          )}

          {post.attachments && post.attachments.length > 0 && (
            <AttachmentDisplay
              attachments={post.attachments}
              variant='compact'
            />
          )}

          {post.commentsEnabled && (
            <CommentSection postId={post.id} classroomId={post.classroomId} />
          )}
        </CardContent>
      </Card>

      <DeleteConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title='Delete Material'
        description='Are you sure you want to delete this material? This action cannot be undone.'
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
