import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Post } from '@/lib/api/services/post.service';
import {
  IconBook,
  IconFileText,
  IconPin,
  IconVideo,
} from '@tabler/icons-react';
import { formatDistanceToNow } from 'date-fns';
import { Download } from 'lucide-react';

interface MaterialCardProps {
  post: Post;
}

export function MaterialCard({ post }: MaterialCardProps) {
  return (
    <Card className='overflow-hidden hover:shadow-md transition-shadow'>
      <CardHeader>
        <div className='flex items-start gap-3'>
          <div className='p-2.5 bg-green-500/10 rounded-full'>
            <IconBook size={20} className='text-green-600' />
          </div>
          <div className='flex-1 min-w-0'>
            <div className='flex items-center gap-2 flex-wrap mb-1'>
              <h3 className='font-medium text-base'>
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

      <CardContent className='space-y-3'>
        {post.content && <p className='text-sm'>{post.content}</p>}

        {/* Placeholder Material Cards */}
        <div className='grid gap-2'>
          <div
            key='material-placeholder-1'
            className='border rounded-lg p-3 bg-emerald-50/50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800'
          >
            <div className='flex items-center gap-3'>
              <div className='p-2 bg-green-100 dark:bg-green-900/30 rounded'>
                <IconFileText size={16} className='text-green-600' />
              </div>
              <div className='flex-1'>
                <p className='text-sm font-medium'>Chapter 5 Notes.pdf</p>
                <p className='text-xs text-muted-foreground'>2.3 MB • PDF</p>
              </div>
              <Button variant='outline' size='icon-sm'>
                <Download />
              </Button>
            </div>
          </div>
          <div
            key='material-placeholder-2'
            className='border rounded-lg p-3 bg-pink-50/50 dark:bg-pink-900/20 border-pink-200 dark:border-pink-800'
          >
            <div className='flex items-center gap-3'>
              <div className='p-2 bg-pink-100 dark:bg-pink-900/30 rounded'>
                <IconVideo size={16} className='text-pink-600' />
              </div>
              <div className='flex-1'>
                <p className='text-sm font-medium'>Lecture Recording.mp4</p>
                <p className='text-xs text-muted-foreground'>45:32 • Video</p>
              </div>
              <Button variant='outline' size='icon-sm'>
                <Download />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
