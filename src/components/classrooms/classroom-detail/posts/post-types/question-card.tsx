import { DeleteConfirmDialog } from '@/components/common/delete-confirm-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useDeletePost } from '@/hooks/use-delete-post';
import { Post } from '@/lib/api/services/post.service';
import { getInitials } from '@/lib/utils';
import { IconPin } from '@tabler/icons-react';
import { formatDistanceToNow } from 'date-fns';
import { Edit2, MoreVertical, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { AttachmentDisplay } from './attachment-display';

interface QuestionCardProps {
  post: Post;
}

import { EditPostDialog } from '../edit-post-dialog';

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
      }
    );
  };

  return (
    <>
      <Card className='overflow-hidden hover:shadow-md transition-shadow'>
        <CardHeader>
          <div className='flex items-start gap-3'>
            <Avatar className='border-2 border-orange-200'>
              <AvatarImage src={post.author?.image || undefined} />
              <AvatarFallback className='bg-orange-100 text-orange-700'>
                {getInitials(post.author?.name)}
              </AvatarFallback>
            </Avatar>
            <div className='flex-1 min-w-0'>
              <div className='flex gap-2 items-center'>
                <p className='font-medium text-sm'>
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
          <CardAction>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button variant='ghost' size='icon-sm'>
                    <MoreVertical />
                  </Button>
                }
              />
              <DropdownMenuContent align='end'>
                <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
                  <Edit2 />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  variant='destructive'
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <Trash2 />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardAction>
        </CardHeader>

        <CardContent className='space-y-4'>
          <p className='text-sm text-foreground leading-relaxed whitespace-pre-wrap'>
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
