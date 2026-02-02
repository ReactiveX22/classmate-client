import { AttachmentUpload } from '@/components/common/attachment-upload';
import { AttachmentDisplay } from '@/components/classrooms/classroom-detail/posts/post-types/attachment-display';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useCreateSubmission } from '@/hooks/use-create-submission';
import { useRemoveSubmissionAttachment } from '@/hooks/use-remove-submission-attachment';
import { useUnsubmit } from '@/hooks/use-unsubmit';
import {
  UploadResult,
  useUploadAttachment,
} from '@/hooks/use-upload-attachment';
import { AssignmentData, postService } from '@/lib/api/services/post.service';
import { Submission } from '@/lib/api/services/submission.service';
import {
  IconCheck,
  IconFilePlus,
  IconLoader2,
  IconPlus,
} from '@tabler/icons-react';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';

interface StudentWorkCardProps {
  classroomId: string;
  postId: string;
  assignmentData?: AssignmentData | null;
  submission?: Submission | null;
}

export function StudentWorkCard({
  classroomId,
  postId,
  assignmentData,
  submission,
}: StudentWorkCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState('');
  const [attachments, setAttachments] = useState<UploadResult[]>([]);
  const [isAddingAttachment, setIsAddingAttachment] = useState(false);

  const { mutate: createSubmission, isPending: isSubmitting } =
    useCreateSubmission();
  const { mutate: unsubmit, isPending: isUnsubmitting } = useUnsubmit();
  const { mutateAsync: removeSubmissionAttachment } =
    useRemoveSubmissionAttachment();
  const { mutateAsync: uploadFile } = useUploadAttachment();

  useEffect(() => {
    if (submission && submission.status === 'assigned') {
      setContent(submission.content || '');
      setAttachments((submission.attachments as UploadResult[]) || []);
      setIsEditing(true);
    } else if (!submission) {
      setContent('');
      setAttachments([]);
      setIsAddingAttachment(false);
      setIsEditing(false); // Default state handles the "Add or create" button
    } else {
      setIsEditing(false); // Submitted state
    }
  }, [submission]);

  const submissionType = assignmentData?.submissionType || 'file';
  const allowsText = submissionType === 'text' || submissionType === 'multiple';
  const allowsFiles =
    submissionType === 'file' || submissionType === 'multiple';

  const getStatusBadge = (submission: Submission | null | undefined) => {
    if (!submission || submission.status === 'assigned') {
      return (
        <Badge
          variant='secondary'
          className='text-xs font-normal text-muted-foreground bg-muted hover:bg-muted'
        >
          Assigned
        </Badge>
      );
    }

    switch (submission.status) {
      case 'turned_in':
        return (
          <Badge className='text-xs font-medium text-green-700 bg-green-100 dark:bg-green-900/30 dark:text-green-400'>
            Turned in
          </Badge>
        );
      case 'graded':
        return (
          <Badge className='text-xs font-medium text-purple-700 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400'>
            Graded
          </Badge>
        );
      case 'returned':
        return (
          <Badge className='text-xs font-medium text-gray-700 bg-gray-100 dark:bg-gray-900/30 dark:text-gray-400'>
            Returned
          </Badge>
        );
      default:
        return null;
    }
  };

  const handleSubmit = () => {
    createSubmission(
      {
        classroomId,
        postId,
        data: {
          content: content.trim() || undefined,
          attachments:
            attachments.length > 0
              ? attachments.map((a) => ({
                  id: a.id,
                  name: a.name,
                  url: a.url,
                  type: a.type,
                  size: a.size,
                  mimeType: a.mimeType,
                }))
              : undefined,
        },
      },
      {
        onSuccess: () => {
          setIsEditing(false);
          setContent('');
          setAttachments([]);
        },
      },
    );
  };

  const handleUnsubmit = () => {
    unsubmit({ classroomId, postId });
  };

  const handleRemoveAttachment = async (id: string) => {
    // Check if it's an existing submission attachment
    const isExisting = submission?.attachments?.some((a) => a.id === id);

    if (isExisting && submission?.status === 'assigned') {
      await removeSubmissionAttachment({
        classroomId,
        postId,
        attachmentId: id,
      });
    } else {
      // It's a new upload, remove from post service (temp upload)
      // Note: This matches logic in AttachmentUpload but we need to call it here
      await postService.removeAttachment(classroomId, id);
    }
  };

  const hasWork = content.trim() || attachments.length > 0;
  const canSubmit = hasWork && !isSubmitting;

  // Submitted / Read-only state
  if (submission && submission.status !== 'assigned') {
    return (
      <Card className='shadow-sm'>
        <CardHeader className='flex flex-row items-center justify-between border-b border-border/50'>
          <CardTitle>Your work</CardTitle>
          {getStatusBadge(submission)}
        </CardHeader>
        <CardContent className='space-y-4'>
          {submission.content && (
            <div className='space-y-2'>
              <p className='text-sm font-medium text-muted-foreground'>
                Your response
              </p>
              <p className='text-sm whitespace-pre-wrap bg-muted/30 rounded-lg p-3'>
                {submission.content}
              </p>
            </div>
          )}

          {submission.attachments && submission.attachments.length > 0 && (
            <div className='space-y-2'>
              <p className='text-sm font-medium text-muted-foreground'>
                Attachments
              </p>
              <AttachmentDisplay
                attachments={submission.attachments}
                variant='compact'
              />
            </div>
          )}

          {submission.status === 'graded' && submission.grade !== undefined && (
            <div className='flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg'>
              <span className='text-sm font-medium'>Grade</span>
              <span className='text-lg font-semibold text-purple-700 dark:text-purple-400'>
                {submission.grade}
                {assignmentData?.points && ` / ${assignmentData.points}`}
              </span>
            </div>
          )}

          {submission.feedback && (
            <div className='space-y-2'>
              <p className='text-sm font-medium text-muted-foreground'>
                Feedback
              </p>
              <p className='text-sm whitespace-pre-wrap bg-muted/30 rounded-lg p-3'>
                {submission.feedback}
              </p>
            </div>
          )}

          <p className='text-xs text-muted-foreground'>
            Submitted on {format(new Date(submission.createdAt), 'PPp')}
          </p>

          {(submission.status === 'turned_in' ||
            submission.status === 'returned') && (
            <Button
              variant='outline'
              className='w-full'
              onClick={handleUnsubmit}
              disabled={isUnsubmitting}
            >
              {isUnsubmitting ? (
                <>
                  <IconLoader2 className='mr-2 h-4 w-4 animate-spin' />
                  Unsubmitting...
                </>
              ) : (
                'Unsubmit'
              )}
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  // Edit/Create Mode (Assigned or New)
  if (isEditing) {
    return (
      <Card className='shadow-sm'>
        <CardHeader className='flex flex-row items-center justify-between border-b border-border/50'>
          <CardTitle>Your work</CardTitle>
          {getStatusBadge(submission)}
        </CardHeader>
        <CardContent className='space-y-4'>
          {allowsText && (
            <div className='space-y-2'>
              <label className='text-sm font-medium text-muted-foreground'>
                Your response
              </label>
              <Textarea
                placeholder='Type your response here...'
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className='min-h-[100px]'
              />
            </div>
          )}

          {allowsFiles && (
            <div className='space-y-2'>
              {attachments.length > 0 || isAddingAttachment ? (
                <div className='space-y-2 animate-in fade-in slide-in-from-top-2 duration-300'>
                  <AttachmentUpload
                    attachments={attachments}
                    onAttachmentsChange={setAttachments}
                    onRemove={handleRemoveAttachment}
                    onUpload={async (file, onProgress) => {
                      return uploadFile({
                        classroomId,
                        file,
                        onProgress,
                      });
                    }}
                  />
                </div>
              ) : (
                <Button
                  variant='outline'
                  className='w-full'
                  onClick={() => setIsAddingAttachment(true)}
                >
                  <IconPlus />
                  Add Work
                </Button>
              )}
            </div>
          )}

          <div className='flex gap-2'>
            <Button
              className='w-full'
              onClick={handleSubmit}
              disabled={!canSubmit}
            >
              {isSubmitting ? (
                <>
                  <IconLoader2 className='mr-2 h-4 w-4 animate-spin' />
                  Submitting...
                </>
              ) : (
                <>
                  <IconCheck className='mr-2 h-4 w-4' />
                  Turn in
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Default empty state (No submission, start fresh)
  return (
    <Card className='shadow-sm'>
      <CardHeader className='flex flex-row items-center justify-between border-b border-border/50'>
        <CardTitle>Your work</CardTitle>
        {getStatusBadge(submission)}
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='flex flex-col items-center justify-center p-6 border-2 border-dashed border-muted-foreground/20 rounded-lg bg-muted/5 text-muted-foreground text-sm transition-colors hover:bg-muted/10'>
          <IconFilePlus className='mb-3 opacity-40' stroke={1.5} size={40} />
          <span>No work attached</span>
        </div>

        <Button
          className='w-full h-10'
          variant='outline'
          onClick={() => {
            setIsEditing(true);
            setIsAddingAttachment(true);
          }}
        >
          <IconPlus size={18} />
          Add or create
        </Button>

        <Button
          className='w-full h-10'
          variant='default'
          onClick={() => setIsEditing(true)}
        >
          Mark as done
        </Button>
      </CardContent>
    </Card>
  );
}
