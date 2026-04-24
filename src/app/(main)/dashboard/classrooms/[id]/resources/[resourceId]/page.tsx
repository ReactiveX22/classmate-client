'use client';

import { CommentSection } from '@/components/classrooms/classroom-detail/posts/comment-section';
import { EditPostDialog } from '@/components/classrooms/classroom-detail/posts/edit-post-dialog';
import { AttachmentDisplay } from '@/components/classrooms/classroom-detail/posts/post-types/attachment-display';
import { DeleteConfirmDialog } from '@/components/common/delete-confirm-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useDeletePost } from '@/hooks/use-delete-post';
import { usePost } from '@/hooks/use-post';
import { useUser } from '@/hooks/useAuth';
import {
  IconArrowLeft,
  IconBook,
  IconDotsVertical,
  IconPencil,
  IconTrash,
} from '@tabler/icons-react';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { use, useState } from 'react';

interface ResourceDetailPageProps {
  params: Promise<{ id: string; resourceId: string }>;
}

export default function ResourceDetailPage({ params }: ResourceDetailPageProps) {
  const { id: classroomId, resourceId } = use(params);
  const router = useRouter();
  const { data: post, isLoading, isError } = usePost(classroomId, resourceId);
  const { data: user } = useUser();
  const deletePost = useDeletePost();

  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const isAuthor = user?.id === post?.authorId;

  const handleDelete = () => {
    if (!post) return;

    deletePost.mutate(
      {
        classroomId: post.classroomId,
        postId: post.id,
      },
      {
        onSuccess: () => {
          setShowDeleteDialog(false);
          router.push(`/dashboard/classrooms/${classroomId}?tab=resources`);
        },
      },
    );
  };

  if (isLoading) {
    return (
      <div className='container max-w-6xl p-4 md:p-6 mx-auto space-y-6'>
        <Skeleton className='h-8 w-40' />
        <Skeleton className='h-10 w-3/5' />
        <div className='grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-8'>
          <Skeleton className='h-72 w-full' />
          <Skeleton className='h-72 w-full' />
        </div>
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className='flex flex-col items-center justify-center min-h-[50vh] gap-3'>
        <h2 className='text-xl font-semibold'>Resource not found</h2>
        <Button
          variant='outline'
          onClick={() => router.push(`/dashboard/classrooms/${classroomId}?tab=resources`)}
        >
          Back to Resources
        </Button>
      </div>
    );
  }

  if (post.type !== 'material') {
    return (
      <div className='flex flex-col items-center justify-center min-h-[50vh] gap-3'>
        <h2 className='text-xl font-semibold'>Unsupported resource type</h2>
        <p className='text-sm text-muted-foreground'>
          This page only supports material resources.
        </p>
        <Button
          variant='outline'
          onClick={() => router.push(`/dashboard/classrooms/${classroomId}?tab=resources`)}
        >
          Back to Resources
        </Button>
      </div>
    );
  }

  return (
    <div className='container max-w-6xl p-4 md:p-6 mx-auto'>
      <Button
        variant='ghost'
        className='mb-6 pl-0 hover:pl-2 transition-all gap-2 text-muted-foreground'
        onClick={() => router.push(`/dashboard/classrooms/${classroomId}?tab=resources`)}
      >
        <IconArrowLeft size={18} />
        Back to Resources
      </Button>

      <div className='flex items-start gap-3 sm:gap-5 mb-5'>
        <div className='p-2 sm:p-3 bg-green-500/10 rounded-full shrink-0'>
          <IconBook className='w-5 h-5 text-green-600' />
        </div>

        <div className='flex-1 min-w-0'>
          <div className='flex items-start justify-between gap-3'>
            <div className='min-w-0'>
              <h1 className='text-xl sm:text-3xl font-semibold tracking-tight'>
                {post.title || 'Class Material'}
              </h1>
              <p className='text-sm text-muted-foreground mt-1'>
                {post.author?.name || 'Unknown'} • Posted{' '}
                {format(new Date(post.createdAt), 'MMM d, yyyy')}
              </p>
            </div>

            {isAuthor && (
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button
                      variant='ghost'
                      size='icon'
                      className='h-8 w-8 text-muted-foreground shrink-0'
                    >
                      <IconDotsVertical size={20} />
                      <span className='sr-only'>Actions</span>
                    </Button>
                  }
                />
                <DropdownMenuContent align='end'>
                  <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
                    <IconPencil className='mr-2 h-4 w-4' />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setShowDeleteDialog(true)}
                    className='text-destructive focus:text-destructive'
                  >
                    <IconTrash className='mr-2 h-4 w-4' />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className='flex flex-wrap gap-2 mt-3'>
              {post.tags.map((tag) => (
                <Badge key={tag} variant='secondary' className='text-xs'>
                  #{tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      <Separator className='my-6' />

      <div className='grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-8'>
        <Card>
          <CardContent className='pt-6'>
            {post.content ? (
              <p className='whitespace-pre-wrap leading-relaxed text-sm sm:text-base'>
                {post.content}
              </p>
            ) : (
              <p className='text-sm text-muted-foreground'>No description provided.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='text-base'>Attachments</CardTitle>
          </CardHeader>
          <CardContent>
            {post.attachments && post.attachments.length > 0 ? (
              <AttachmentDisplay attachments={post.attachments} variant='default' />
            ) : (
              <p className='text-sm text-muted-foreground'>No attachments</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className='mt-8'>
        <CardHeader>
          <CardTitle className='text-base'>Discussion</CardTitle>
        </CardHeader>
        <CardContent>
          {post.commentsEnabled ? (
            <CommentSection postId={post.id} classroomId={post.classroomId} />
          ) : (
            <p className='text-sm text-muted-foreground'>Comments are disabled for this resource.</p>
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
    </div>
  );
}
