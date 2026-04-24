'use client';

import { DeleteConfirmDialog } from '@/components/common/delete-confirm-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Progress,
  ProgressLabel,
} from '@/components/ui/progress';
import { useDeletePost } from '@/hooks/use-delete-post';
import { useUser } from '@/hooks/useAuth';
import { useVoteOnPoll } from '@/hooks/use-vote-on-poll';
import { PollQuestionData, Post } from '@/lib/api/services/post.service';
import { getInitials } from '@/lib/utils';
import { IconPin } from '@tabler/icons-react';
import { formatDistanceToNow } from 'date-fns';
import { useEffect, useState } from 'react';
import { CommentSection } from '../comment-section';
import { EditPostDialog } from '../edit-post-dialog';
import { AttachmentDisplay } from './attachment-display';
import { PostCardActions } from './post-card-actions';

interface QuestionCardProps {
  post: Post;
  isTeacher?: boolean;
}

function PollCard({
  post,
  poll,
}: {
  post: Post;
  poll: PollQuestionData;
}) {
  const { data: user } = useUser();
  const voteOnPoll = useVoteOnPoll();
  const isAuthor = user?.id === post.authorId;
  const hasVoted = (poll.viewerVoteOptionIds?.length ?? 0) > 0;
  const [selectedOptionIds, setSelectedOptionIds] = useState<string[]>(
    poll.viewerVoteOptionIds ?? [],
  );

  useEffect(() => {
    setSelectedOptionIds(poll.viewerVoteOptionIds ?? []);
  }, [poll.viewerVoteOptionIds]);

  const handleSingleChoiceVote = (optionId: string) => {
    setSelectedOptionIds([optionId]);
    voteOnPoll.mutate({
      classroomId: post.classroomId,
      postId: post.id,
      data: { optionIds: [optionId] },
    });
  };

  const handleToggleMultipleOption = (optionId: string, checked: boolean) => {
    setSelectedOptionIds((currentValue) => {
      if (checked) {
        return Array.from(new Set([...currentValue, optionId]));
      }

      return currentValue.filter((currentOptionId) => currentOptionId !== optionId);
    });
  };

  const showResults = isAuthor || hasVoted;

  return (
    <div className='space-y-4'>
      {poll.options.map((option) => {
        const result = poll.results?.find(
          (currentResult) => currentResult.optionId === option.id,
        );
        const isChecked = selectedOptionIds.includes(option.id);

        return (
          <div key={option.id} className='space-y-2 rounded-lg border p-3'>
            <label className='flex cursor-pointer items-start gap-3'>
              {poll.selectionMode === 'single' ? (
                <input
                  type='radio'
                  name={`poll-${post.id}`}
                  className='mt-1 h-4 w-4 accent-primary'
                  checked={isChecked}
                  onChange={() => handleSingleChoiceVote(option.id)}
                  disabled={voteOnPoll.isPending}
                />
              ) : (
                <Checkbox
                  checked={isChecked}
                  onCheckedChange={(checked) =>
                    handleToggleMultipleOption(option.id, Boolean(checked))
                  }
                  disabled={voteOnPoll.isPending}
                />
              )}
              <span className='text-sm leading-6'>{option.text}</span>
            </label>

            {showResults && result && (
              <div className='space-y-2 pl-7'>
                <Progress value={result.percentage}>
                    <div className='flex items-center gap-2 text-sm'>
                      <ProgressLabel>{option.text}</ProgressLabel>
                      <span className='ml-auto text-sm tabular-nums text-muted-foreground'>
                        {result.percentage}% ({result.voteCount})
                      </span>
                    </div>
                </Progress>

                {poll.canViewVoters && result.voters && result.voters.length > 0 && (
                  <Collapsible>
                    <CollapsibleTrigger
                      render={
                        <Button variant='ghost' size='sm' className='h-auto px-0'>
                          View voters
                        </Button>
                      }
                    />
                    <CollapsibleContent>
                      <div className='space-y-2 pt-2'>
                        {result.voters.map((viewer) => (
                          <div
                            key={`${option.id}-${viewer.id}`}
                            className='flex items-center gap-2 text-sm text-muted-foreground'
                          >
                            <Avatar className='h-6 w-6'>
                              <AvatarImage src={viewer.image || undefined} />
                              <AvatarFallback>
                                {getInitials(viewer.name || undefined)}
                              </AvatarFallback>
                            </Avatar>
                            <span>{viewer.name || 'Unknown user'}</span>
                          </div>
                        ))}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                )}
              </div>
            )}
          </div>
        );
      })}

      {poll.selectionMode === 'multiple' && (
        <div className='flex items-center justify-between gap-3'>
          <p className='text-xs text-muted-foreground'>
            Select one or more options, then submit your vote.
          </p>
          <Button
            type='button'
            size='sm'
            disabled={selectedOptionIds.length === 0 || voteOnPoll.isPending}
            onClick={() =>
              voteOnPoll.mutate({
                classroomId: post.classroomId,
                postId: post.id,
                data: { optionIds: selectedOptionIds },
              })
            }
          >
            {hasVoted ? 'Update Vote' : 'Submit Vote'}
          </Button>
        </div>
      )}

      <p className='text-xs text-muted-foreground'>
        {poll.totalVotes ?? 0} total vote{poll.totalVotes === 1 ? '' : 's'}
      </p>
    </div>
  );
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
            <Avatar className='border-2 border-orange-200'>
              <AvatarImage src={post.author?.image || undefined} />
              <AvatarFallback className='bg-orange-100 text-orange-700'>
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

          <p className='whitespace-pre-wrap text-sm leading-relaxed text-foreground'>
            {post.content}
          </p>

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
