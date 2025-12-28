import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Post } from '@/lib/api/services/post.service';
import {
  IconBook,
  IconFileText,
  IconPin,
  IconVideo,
} from '@tabler/icons-react';
import { formatDistanceToNow } from 'date-fns';

interface MaterialCardProps {
  post: Post;
}

export function MaterialCard({ post }: MaterialCardProps) {
  return (
    <Card className='overflow-hidden hover:shadow-md transition-shadow'>
      <CardHeader className='pb-3'>
        <div className='flex items-start gap-3'>
          <div className='p-2.5 bg-green-500/10 rounded-full'>
            <IconBook size={20} className='text-green-600' />
          </div>
          <div className='flex-1 min-w-0'>
            <div className='flex items-center gap-2 flex-wrap mb-1'>
              <h3 className='font-semibold text-base'>
                {post.title || 'Class Material'}
              </h3>
              {post.isPinned && (
                <Badge variant='secondary' className='gap-1 h-5'>
                  <IconPin size={12} />
                </Badge>
              )}
            </div>
            <p className='text-xs text-muted-foreground'>
              {post.author?.name || 'Unknown'} •{' '}
              {formatDistanceToNow(new Date(post.createdAt), {
                addSuffix: true,
              })}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className='space-y-3 pt-0'>
        {post.content && (
          <p className='text-sm text-muted-foreground'>{post.content}</p>
        )}

        {/* Placeholder Material Cards */}
        <div className='grid gap-2'>
          <div
            key='material-placeholder-1'
            className='border rounded-lg p-3 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800'
          >
            <div className='flex items-center gap-3'>
              <div className='p-2 bg-green-100 dark:bg-green-900/30 rounded'>
                <IconFileText size={20} className='text-green-600' />
              </div>
              <div className='flex-1'>
                <p className='text-sm font-medium'>Chapter 5 Notes.pdf</p>
                <p className='text-xs text-muted-foreground'>2.3 MB • PDF</p>
              </div>
            </div>
          </div>
          <div
            key='material-placeholder-2'
            className='border rounded-lg p-3 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border-blue-200 dark:border-blue-800'
          >
            <div className='flex items-center gap-3'>
              <div className='p-2 bg-blue-100 dark:bg-blue-900/30 rounded'>
                <IconVideo size={20} className='text-blue-600' />
              </div>
              <div className='flex-1'>
                <p className='text-sm font-medium'>Lecture Recording.mp4</p>
                <p className='text-xs text-muted-foreground'>45:32 • Video</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
