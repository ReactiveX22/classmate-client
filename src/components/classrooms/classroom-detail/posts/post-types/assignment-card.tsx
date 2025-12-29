import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Post } from '@/lib/api/services/post.service';
import { IconCalendar, IconClipboard, IconPin } from '@tabler/icons-react';
import { format, formatDistanceToNow } from 'date-fns';
import { AttachmentDisplay } from './attachment-display';

interface AssignmentCardProps {
  post: Post;
  onNavigate?: () => void;
}

export function AssignmentCard({ post, onNavigate }: AssignmentCardProps) {
  return (
    <Card className='overflow-hidden hover:shadow-md transition-shadow'>
      <CardContent>
        <div className='space-y-4'>
          {/* Header */}
          <div
            className='flex items-start gap-4 cursor-pointer'
            onClick={onNavigate}
          >
            <div className='p-3 bg-blue-500/10 rounded-full'>
              <IconClipboard size={20} className='text-blue-600' />
            </div>
            <div className='flex-1 min-w-0 space-y-2'>
              <div className='flex items-start justify-between gap-4'>
                <div className='flex-1'>
                  <div className='flex items-center gap-2 flex-wrap mb-1'>
                    <h3 className='font-medium text-sm'>{post.title}</h3>
                    {post.isPinned && (
                      <IconPin size={16} className='text-muted-foreground' />
                    )}
                  </div>
                  <p className='text-xs text-muted-foreground'>
                    Posted by {post.author?.name || 'Unknown'} •{' '}
                    {formatDistanceToNow(new Date(post.createdAt), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
                {post.assignmentData?.points && (
                  <Badge
                    variant='outline'
                    className='bg-blue-500/5 border-blue-200 text-blue-700'
                  >
                    {post.assignmentData.points} pts
                  </Badge>
                )}
              </div>

              {post.assignmentData?.dueDate && (
                <div className='flex items-center gap-1.5 text-xs'>
                  <IconCalendar className='size-4 text-muted-foreground' />
                  <span className='font-medium'>
                    Due {format(new Date(post.assignmentData.dueDate), 'PPp')}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Attachments */}
          {post.attachments && post.attachments.length > 0 && (
            <div>
              <AttachmentDisplay
                attachments={post.attachments}
                variant='compact'
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
