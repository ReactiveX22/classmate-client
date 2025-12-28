import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Post } from '@/lib/api/services/post.service';
import { IconHelpCircle, IconPaperclip, IconPin } from '@tabler/icons-react';
import { formatDistanceToNow } from 'date-fns';
import { getAuthorInitials } from '../post-helpers';

interface QuestionCardProps {
  post: Post;
}

export function QuestionCard({ post }: QuestionCardProps) {
  return (
    <Card className='overflow-hidden hover:shadow-md transition-shadow'>
      <CardHeader className='pb-3 bg-orange-50/50 dark:bg-orange-950/10'>
        <div className='flex items-start gap-3'>
          <Avatar className='border-2 border-orange-200'>
            <AvatarImage src={post.author?.image || undefined} />
            <AvatarFallback className='bg-orange-100 text-orange-700'>
              {getAuthorInitials(post.author?.name)}
            </AvatarFallback>
          </Avatar>
          <div className='flex-1 min-w-0'>
            <div className='flex items-center gap-2 mb-1'>
              <IconHelpCircle size={18} className='text-orange-600' />
              <Badge
                variant='outline'
                className='bg-orange-500/10 text-orange-700 border-orange-200'
              >
                Question
              </Badge>
              {post.isPinned && (
                <Badge variant='secondary' className='gap-1 h-5'>
                  <IconPin size={12} />
                </Badge>
              )}
            </div>
            <p className='font-semibold text-sm'>
              {post.author?.name || 'Unknown'}
            </p>
            <p className='text-xs text-muted-foreground'>
              {formatDistanceToNow(new Date(post.createdAt), {
                addSuffix: true,
              })}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className='space-y-3 pt-4'>
        {post.title && (
          <h3 className='font-semibold text-base'>{post.title}</h3>
        )}
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
