'use client';

import { StudentWorkCard } from '@/components/classrooms/classroom-detail/assignments/student-work-card';
import { EditPostDialog } from '@/components/classrooms/classroom-detail/posts/edit-post-dialog';
import { AttachmentDisplay } from '@/components/classrooms/classroom-detail/posts/post-types/attachment-display';
import { DeleteConfirmDialog } from '@/components/common/delete-confirm-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
  IconClipboard,
  IconDotsVertical,
  IconMessageCircle,
  IconPencil,
  IconTrash,
} from '@tabler/icons-react';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { use, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StudentWorkTab } from '@/components/classrooms/classroom-detail/assignments/student-work-tab';

interface AssignmentPageProps {
  params: Promise<{ id: string; assignmentId: string }>;
}

export default function AssignmentPage({ params }: AssignmentPageProps) {
  const { id: classroomId, assignmentId } = use(params);
  const router = useRouter();
  const { data: post, isLoading, isError } = usePost(classroomId, assignmentId);
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
          router.push(`/dashboard/classrooms/${classroomId}`);
        },
      },
    );
  };

  if (isLoading) {
    return (
      <div className='container max-w-5xl py-8 space-y-8'>
        <Skeleton className='h-8 w-32' />
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          <div className='lg:col-span-2 space-y-4'>
            <Skeleton className='h-12 w-3/4' />
            <Skeleton className='h-4 w-1/4' />
            <Skeleton className='h-64 w-full' />
          </div>
          <div className='lg:col-span-1'>
            <Skeleton className='h-64 w-full' />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className='flex flex-col items-center justify-center min-h-[50vh]'>
        <h2 className='text-xl font-semibold mb-2'>Assignment not found</h2>
        <Button onClick={() => router.back()}>Go back</Button>
      </div>
    );
  }

  return (
    <div className='container max-w-6xl p-4 md:p-6 mx-auto'>
      <Button
        variant='ghost'
        className='mb-6 pl-0 hover:pl-2 transition-all gap-2 text-muted-foreground'
        onClick={() => router.back()}
      >
        <IconArrowLeft size={18} />
        Back to Classwork
      </Button>

      <div className='flex items-start gap-5 mb-6'>
        <div className='p-3.5 bg-primary/10 rounded-full text-primary mt-1'>
          <IconClipboard size={24} />
        </div>
        <div className='flex-1 space-y-2'>
          <div className='flex items-start justify-between gap-4'>
            <div className='flex-1'>
              <h1 className='text-3xl font-semibold tracking-tight text-foreground'>
                {post.title}
              </h1>
              <div className='flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground mt-2'>
                <span className='font-medium text-foreground'>
                  {post.author?.name}
                </span>
                <span>•</span>
                <span>Posted {format(new Date(post.createdAt), 'MMM d')}</span>
              </div>
            </div>

            <div className='flex items-start gap-3'>
              <div className='flex flex-col items-end gap-1.5'>
                {post.assignmentData?.points && (
                  <Badge
                    variant='outline'
                    className='bg-blue-500/5 border-blue-200 text-blue-700'
                  >
                    {post.assignmentData.points} points
                  </Badge>
                )}
                {post.assignmentData?.dueDate && (
                  <Badge
                    variant='outline'
                    className='bg-red-500/5 border-red-200 text-red-700'
                  >
                    Due {format(new Date(post.assignmentData.dueDate), 'PPp')}
                  </Badge>
                )}
              </div>

              {isAuthor && (
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <Button
                        variant='ghost'
                        size='icon'
                        className='h-8 w-8 text-muted-foreground'
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
          </div>
        </div>
      </div>

      <Separator className='my-6' />

      {isAuthor ? (
        <Tabs defaultValue='instructions' className='w-full'>
          <TabsList className='mb-6'>
            <TabsTrigger value='instructions'>Instructions</TabsTrigger>
            <TabsTrigger value='student-work'>Submissions</TabsTrigger>
          </TabsList>

          <TabsContent value='instructions' className='space-y-6'>
            <AssignmentContent
              post={post}
              isAuthor={isAuthor}
              classroomId={classroomId}
              assignmentId={assignmentId}
            />
          </TabsContent>

          <TabsContent value='student-work'>
            <StudentWorkTab
              classroomId={classroomId}
              postId={assignmentId}
              maxPoints={post.assignmentData?.points}
              dueDate={post.assignmentData?.dueDate}
            />
          </TabsContent>
        </Tabs>
      ) : (
        <div className='space-y-6'>
          <AssignmentContent
            post={post}
            isAuthor={isAuthor}
            classroomId={classroomId}
            assignmentId={assignmentId}
          />
        </div>
      )}

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
    </div>
  );
}

function AssignmentContent({
  post,
  isAuthor,
  classroomId,
  assignmentId,
}: {
  post: any;
  isAuthor: boolean;
  classroomId: string;
  assignmentId: string;
}) {
  return (
    <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
      {/* Left Column - Assignment Details */}
      <div className='lg:col-span-2 space-y-6'>
        <div className='prose prose-zinc dark:prose-invert max-w-none'>
          <p className='whitespace-pre-wrap leading-relaxed text-base'>
            {post.content}
          </p>
        </div>

        {post.attachments && post.attachments.length > 0 && (
          <div className='space-y-4 pt-2'>
            <h3 className='font-medium text-muted-foreground text-xs'>
              Attachments
            </h3>
            <AttachmentDisplay
              attachments={post.attachments}
              variant='default'
            />
          </div>
        )}

        <Separator className='my-8 bg-border/60' />

        <div className='flex items-center gap-3 text-muted-foreground text-sm py-4 border-t border-b border-dashed border-border/60'>
          <IconMessageCircle size={20} />
          <span>Class comments coming soon</span>
        </div>
      </div>

      {/* Right Column - Your Work (Students only) */}
      {!isAuthor && (
        <div className='lg:col-span-1 space-y-6'>
          <StudentWorkCard
            classroomId={classroomId}
            postId={assignmentId}
            assignmentData={post.assignmentData}
            submission={post.submission}
          />
        </div>
      )}
    </div>
  );
}
