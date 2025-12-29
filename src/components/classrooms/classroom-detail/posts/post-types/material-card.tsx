import { DeleteConfirmDialog } from '@/components/common/delete-confirm-dialog';
import { Badge } from '@/components/ui/badge';
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
import { IconBook, IconPin } from '@tabler/icons-react';
import { formatDistanceToNow } from 'date-fns';
import { Edit2, MoreVertical, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { AttachmentDisplay } from './attachment-display';

interface MaterialCardProps {
  post: Post;
}

export function MaterialCard({ post }: MaterialCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
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
            <div className='p-2.5 bg-green-500/10 rounded-full'>
              <IconBook size={20} className='text-green-600' />
            </div>
            <div className='flex-1 min-w-0'>
              <div className='flex items-center gap-2 flex-wrap mb-1'>
                <h3 className='font-medium text-sm'>
                  {post.title || 'Class Material'}
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
                <DropdownMenuItem disabled>
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
          {post.content && (
            <p className='text-sm whitespace-pre-wrap leading-relaxed'>
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
        title='Delete Material'
        description='Are you sure you want to delete this material? This action cannot be undone.'
        onConfirm={handleDelete}
        confirmText='Delete'
        isLoading={deletePost.isPending}
      />
    </>
  );
}
