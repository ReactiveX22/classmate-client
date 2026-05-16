'use client';

import { DeleteConfirmDialog } from '@/components/common/delete-confirm-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useDeletePost } from '@/hooks/use-delete-post';
import { Post } from '@/lib/api/services/post.service';
import { getInitials } from '@/lib/utils';
import { IconPin } from '@tabler/icons-react';
import { formatDistanceToNow } from 'date-fns';
import { useState } from 'react';
import { CommentSection } from '../comment-section';
import { EditPostDialog } from '../edit-post-dialog';
import { AttachmentDisplay } from './attachment-display';
import { ExpandableContent } from './expandable-content';
import { PollCard } from './poll-card';
import { PostCardActions } from './post-card-actions';

interface QuestionCardProps {
  post: Post;
  isTeacher?: boolean;
}

export function QuestionCard({ post }: QuestionCardProps) {
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
      },
    );
  };

  const questionData = post.questionData;
  const isPoll = questionData?.mode === 'poll';

  return (
    <>
      <Card className='overflow-hidden transition-shadow hover:shadow-md'>
        <CardHeader>
          <div className='flex items-start gap-3'>
            <Avatar className='w-8 h-8 sm:w-10 sm:h-10 shrink-0'>
              <AvatarImage src={post.author?.image || undefined} />
              <AvatarFallback>
                {getInitials(post.author?.name)}
              </AvatarFallback>
            </Avatar>
            <div className='min-w-0 flex-1'>
              <div className='flex items-center gap-2'>
                <p className='text-sm font-medium'>
                  {post.author?.name || 'Unknown'}
                </p>
                {post.isPinned && (
                  <IconPin size={16} className='text-muted-foreground' />
                )}
              </div>
              <p className='text-xs text-muted-foreground'>
                {formatDistanceToNow(new Date(post.createdAt), {
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

        <CardContent className='space-y-4'>
          {post.title && <h3 className='text-base font-semibold'>{post.title}</h3>}

          <ExpandableContent content={post.content} />

          {isPoll && <PollCard post={post} poll={questionData} />}

          {post.attachments && post.attachments.length > 0 && (
            <AttachmentDisplay attachments={post.attachments} />
          )}

          {post.commentsEnabled && (
            <CommentSection postId={post.id} classroomId={post.classroomId} />
          )}
        </CardContent>
      </Card>

      <DeleteConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title='Delete Question'
        description='Are you sure you want to delete this question? This action cannot be undone.'
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
