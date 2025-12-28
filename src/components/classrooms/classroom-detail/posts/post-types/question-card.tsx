import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Post } from '@/lib/api/services/post.service';
import { getInitials } from '@/lib/utils';
import { IconHelpCircle, IconPaperclip, IconPin } from '@tabler/icons-react';
import { formatDistanceToNow } from 'date-fns';

interface QuestionCardProps {
  post: Post;
}

export function QuestionCard({ post }: QuestionCardProps) {
  return (
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
      </CardHeader>

      <CardContent className='space-y-3'>
        <p className='text-sm text-foreground leading-relaxed'>
          {post.content}
        </p>

        {post.attachments && post.attachments.length > 0 && (
          <div className='flex items-center gap-2 pt-2 text-xs text-muted-foreground'>
            <IconPaperclip size={14} />
            <span>
              {post.attachments.length}{' '}
              {post.attachments.length === 1 ? 'attachment' : 'attachments'}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
