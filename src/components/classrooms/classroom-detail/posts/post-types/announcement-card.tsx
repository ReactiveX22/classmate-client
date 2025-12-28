import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
} from '@/components/ui/card';
import { Post } from '@/lib/api/services/post.service';
import { IconPin } from '@tabler/icons-react';
import { formatDistanceToNow } from 'date-fns';
import { MoreVertical } from 'lucide-react';
import { getAttachmentIcon, getAuthorInitials } from '../post-helpers';

interface AnnouncementCardProps {
  post: Post;
}

export function AnnouncementCard({ post }: AnnouncementCardProps) {
  return (
    <Card className='overflow-hidden hover:shadow-md transition-shadow'>
      <CardHeader>
        <div className='flex items-start gap-3'>
          <Avatar>
            <AvatarImage src={post.author?.image || undefined} />
            <AvatarFallback>
              {getAuthorInitials(post.author?.name)}
            </AvatarFallback>
          </Avatar>
          <div className='flex-1 min-w-0'>
            <div className='flex items-center gap-2 flex-wrap'>
              <p className='font-semibold text-sm'>
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
        <CardAction>
          <Button variant='ghost' size='icon-sm'>
            <MoreVertical />
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent className='space-y-3 pt-0'>
        <p className='text-sm text-foreground whitespace-pre-wrap leading-relaxed'>
          {post.content}
        </p>

        {post.attachments && post.attachments.length > 0 && (
          <div className='grid gap-2 pt-2'>
            {post.attachments.map((attachment) => {
              const Icon = getAttachmentIcon(attachment.type);
              return (
                <a
                  key={attachment.id}
                  href={attachment.url}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors group'
                >
                  <div className='p-2 bg-muted rounded-md group-hover:bg-muted/80'>
                    <Icon size={20} className='text-muted-foreground' />
                  </div>
                  <div className='flex-1 min-w-0'>
                    <p className='text-sm font-medium truncate'>
                      {attachment.name}
                    </p>
                    {attachment.size && (
                      <p className='text-xs text-muted-foreground'>
                        {(attachment.size / 1024).toFixed(1)} KB
                      </p>
                    )}
                  </div>
                </a>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
