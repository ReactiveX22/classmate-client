import { DeleteConfirmDialog } from '@/components/common/delete-confirm-dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useDeletePost } from '@/hooks/use-delete-post';
import { Post } from '@/lib/api/services/post.service';
import { Submission } from '@/lib/api/services/submission.service';
import {
  IconCalendar,
  IconCheck,
  IconClipboard,
  IconClock,
  IconFile,
  IconPin,
} from '@tabler/icons-react';
import { format, formatDistanceToNow } from 'date-fns';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { EditPostDialog } from '../edit-post-dialog';
import { AttachmentDisplay } from './attachment-display';
import { PostCardActions } from './post-card-actions';

interface AssignmentCardProps {
  post: Post;
  isTeacher?: boolean;
}

export function AssignmentCard({
  post,
  isTeacher = false,
}: AssignmentCardProps) {
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const deletePost = useDeletePost();

  const handleNavigate = () => {
    router.push(
      `/dashboard/classrooms/${post.classroomId}/assignments/${post.id}`,
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
      },
    );
  };

  const getSubmissionBadge = (submission: Submission) => {
    switch (submission.status) {
      case 'assigned':
        return (
          <Badge
            variant='outline'
            className='text-muted-foreground font-normal bg-transparent border-dashed'
          >
            Assigned
          </Badge>
        );
      case 'turned_in':
        return (
          <Badge
            variant='secondary'
            className='bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400 gap-1'
          >
            <IconCheck size={14} />
            Turned in
          </Badge>
        );
      case 'graded':
        return (
          <Badge
            variant='secondary'
            className='bg-purple-100 text-purple-700 hover:bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400 gap-1'
          >
            <IconCheck size={14} />
            Graded
          </Badge>
        );
      case 'returned':
        return (
          <Badge
            variant='secondary'
            className='bg-gray-100 text-gray-700 hover:bg-gray-100 dark:bg-gray-900/30 dark:text-gray-400 gap-1'
          >
            Returned
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Card
        className='overflow-hidden hover:shadow-md transition-shadow cursor-pointer'
        onClick={handleNavigate}
      >
        <CardHeader>
          <div className='flex items-start gap-2.5 sm:gap-4'>
            <div className='p-2 sm:p-3 bg-blue-500/10 rounded-full shrink-0'>
              <IconClipboard className='w-4 h-4 sm:w-5 sm:h-5 text-blue-600' />
            </div>
            <div className='flex-1 min-w-0 space-y-2'>
              <div className='flex items-start justify-between gap-2'>
                <div className='flex-1 min-w-0'>
                  <h3 className='font-medium text-sm'>{post.title}</h3>
                  <p className='text-xs text-muted-foreground mt-1'>
                    Posted by {post.author?.name || 'Unknown'} •{' '}
                    {formatDistanceToNow(new Date(post.createdAt), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
                {/* Badges: hidden on mobile, shown on sm+ */}
                <div className='hidden sm:flex flex-col items-end gap-1.5 shrink-0'>
                  {post.assignmentData?.points && (
                    <Badge
                      variant='outline'
                      className='bg-blue-500/5 border-blue-200 text-blue-700'
                    >
                      {post.assignmentData.points} pts
                    </Badge>
                  )}
                  {isTeacher && post.submissionStats && (
                    <Badge
                      variant='outline'
                      className={
                        post.submissionStats.graded ===
                        post.submissionStats.total
                          ? 'bg-green-500/5 border-green-200 text-green-700'
                          : 'bg-amber-500/5 border-amber-200 text-amber-700'
                      }
                    >
                      {post.submissionStats.graded}/{post.submissionStats.total}{' '}
                      graded
                    </Badge>
                  )}
                  {!isTeacher &&
                    (post.submission ? (
                      getSubmissionBadge(post.submission)
                    ) : (
                      <Badge
                        variant='outline'
                        className='text-muted-foreground font-normal bg-transparent border-dashed'
                      >
                        Assigned
                      </Badge>
                    ))}
                </div>
              </div>

              {/* Badges: shown on mobile as a row below title */}
              <div className='flex sm:hidden flex-wrap items-center gap-1.5'>
                {post.assignmentData?.points && (
                  <Badge
                    variant='outline'
                    className='bg-blue-500/5 border-blue-200 text-blue-700'
                  >
                    {post.assignmentData.points} pts
                  </Badge>
                )}
                {isTeacher && post.submissionStats && (
                  <Badge
                    variant='outline'
                    className={
                      post.submissionStats.graded === post.submissionStats.total
                        ? 'bg-green-500/5 border-green-200 text-green-700'
                        : 'bg-amber-500/5 border-amber-200 text-amber-700'
                    }
                  >
                    {post.submissionStats.graded}/{post.submissionStats.total}{' '}
                    graded
                  </Badge>
                )}
                {!isTeacher &&
                  (post.submission ? (
                    getSubmissionBadge(post.submission)
                  ) : (
                    <Badge
                      variant='outline'
                      className='text-muted-foreground font-normal bg-transparent border-dashed'
                    >
                      Assigned
                    </Badge>
                  ))}
              </div>

              {post.assignmentData?.dueDate && (
                <div className='flex items-center gap-1.5 text-xs'>
                  <IconCalendar className='size-4 text-muted-foreground shrink-0' />
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
            <p className='text-sm text-foreground mb-4 whitespace-pre-wrap leading-relaxed line-clamp-3'>
              {post.content}
            </p>
          )}

          <div className='flex flex-wrap gap-2'>
            {post.attachments && post.attachments.length > 0 && (
              <Badge variant='outline' className='gap-1 text-muted-foreground'>
                <IconFile size={12} />
                {post.attachments.length} attachment
                {post.attachments.length !== 1 ? 's' : ''}
              </Badge>
            )}
            {!isTeacher &&
              post.submission?.attachments &&
              post.submission.attachments.length > 0 && (
                <Badge
                  variant='outline'
                  className='gap-1 text-muted-foreground'
                >
                  <IconFile size={12} />
                  {post.submission.attachments.length} attachment
                  {post.submission.attachments.length !== 1 ? 's' : ''}{' '}
                  submitted
                </Badge>
              )}
          </div>
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
