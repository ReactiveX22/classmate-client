import { usePosts } from '@/hooks/use-posts';
import { PostCard } from './post-card';
import { PostSkeleton } from './post-skeleton';
import { Button } from '@/components/ui/button';
import { IconLoader2 } from '@tabler/icons-react';
import { useEffect, useRef } from 'react';

interface PostListProps {
  classroomId: string;
}

export function PostList({ classroomId }: PostListProps) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = usePosts(classroomId, { limit: 10 });

  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (isLoading) {
    return (
      <div className='space-y-4'>
        {[...Array(3)].map((_, i) => (
          <PostSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className='text-center py-12'>
        <p className='text-sm text-muted-foreground'>
          Failed to load posts. Please try again.
        </p>
      </div>
    );
  }

  const posts = data?.pages.flatMap((page) => page.data) ?? [];
  console.log(posts);
  if (posts.length === 0) {
    return null; // Parent will handle empty state
  }

  return (
    <div className='space-y-4'>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}

      {/* Intersection observer target */}
      <div ref={observerTarget} className='h-4' />

      {isFetchingNextPage && (
        <div className='flex justify-center py-4'>
          <Button variant='ghost' disabled>
            <IconLoader2 className='mr-2 h-4 w-4 animate-spin' />
            Loading more posts...
          </Button>
        </div>
      )}

      {!hasNextPage && posts.length > 0 && (
        <div className='text-center py-4'>
          <p className='text-xs text-muted-foreground'>
            You&apos;ve reached the end
          </p>
        </div>
      )}
    </div>
  );
}
