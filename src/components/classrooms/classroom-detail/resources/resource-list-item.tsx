import { Badge } from '@/components/ui/badge';
import { Post } from '@/lib/api/services/post.service';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';

interface ResourceListItemProps {
  post: Post;
  href: string;
}

export function ResourceListItem({ post, href }: ResourceListItemProps) {
  return (
    <Link
      href={href}
      className='block rounded-md border border-transparent px-2 py-2 hover:border-border hover:bg-muted/50 transition-colors'
    >
      <p className='text-sm font-medium line-clamp-2'>{post.title || 'Class Material'}</p>
      <p className='text-xs text-muted-foreground mt-1'>
        {post.author?.name || 'Unknown'} •{' '}
        {formatDistanceToNow(new Date(post.createdAt), {
          addSuffix: true,
        })}
      </p>

      {post.tags && post.tags.length > 0 && (
        <div className='flex flex-wrap gap-1 mt-2'>
          {post.tags.slice(0, 2).map((tag) => (
            <Badge key={`${post.id}-${tag}`} variant='secondary' className='text-[10px]'>
              #{tag}
            </Badge>
          ))}
        </div>
      )}
    </Link>
  );
}
