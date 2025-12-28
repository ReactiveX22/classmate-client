import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Post } from '@/lib/api/services/post.service';
import {
  IconCalendar,
  IconClipboard,
  IconPaperclip,
  IconPin,
} from '@tabler/icons-react';
import { format, formatDistanceToNow } from 'date-fns';

interface AssignmentCardProps {
  post: Post;
}

export function AssignmentCard({ post }: AssignmentCardProps) {
  return (
    <Card className='overflow-hidden hover:shadow-md transition-shadow cursor-pointer'>
      <CardContent>
        <div className='flex items-start gap-4'>
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

            {post.attachments && post.attachments.length > 0 && (
              <div className='flex items-center gap-1.5 text-xs text-muted-foreground'>
                <IconPaperclip size={14} />
                <span>
                  {post.attachments.length}{' '}
                  {post.attachments.length === 1 ? 'attachment' : 'attachments'}
                </span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
