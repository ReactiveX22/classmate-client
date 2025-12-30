'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { usePosts } from '@/hooks/use-posts';
import { IconClipboardList, IconLoader2, IconPlus } from '@tabler/icons-react';
import { useMemo } from 'react';
import { CreatePostDialog } from './posts/create-post-dialog';
import { AssignmentCard } from './posts/post-types/assignment-card';
import { useRouter } from 'next/navigation';

interface ClassworkTabProps {
  classroomId: string;
}

export function ClassworkTab({ classroomId }: ClassworkTabProps) {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    usePosts(classroomId, { limit: 20 });

  const assignments = useMemo(() => {
    if (!data) return [];
    // Flatten pages and filter only assignments
    return data.pages
      .flatMap((page) => page.data)
      .filter((post) => post.type === 'assignment');
  }, [data]);

  const isEmpty = !isLoading && assignments.length === 0;

  return (
    <div className='max-w-3xl mx-auto mt-6 space-y-6 pb-20'>
      <div className='flex items-center justify-between mb-6'>
        <h2 className='text-2xl font-semibold tracking-tight'>Classwork</h2>
        <CreatePostDialog
          classroomId={classroomId}
          trigger={
            <Button className='gap-2 shadow-sm'>
              <IconPlus size={18} />
              <span>Create</span>
            </Button>
          }
        />
      </div>

      {isLoading ? (
        <div className='flex justify-center py-12'>
          <IconLoader2 className='animate-spin text-muted-foreground' />
        </div>
      ) : isEmpty ? (
        <Card className='border-dashed shadow-none bg-muted/30'>
          <CardContent className='flex flex-col items-center justify-center py-16 text-center'>
            <div className='p-4 bg-background rounded-full mb-4 shadow-sm'>
              <IconClipboardList className='w-8 h-8 text-muted-foreground' />
            </div>
            <h3 className='text-lg font-medium mb-1'>No assignments yet</h3>
            <p className='text-muted-foreground text-sm max-w-sm mx-auto mb-6'>
              Assignments you create will appear here. Students can view details
              and submit their work.
            </p>
            <CreatePostDialog
              classroomId={classroomId}
              trigger={<Button variant='outline'>Create assignment</Button>}
            />
          </CardContent>
        </Card>
      ) : (
        <div className='space-y-4'>
          {assignments.map((post) => (
            <AssignmentCard key={post.id} post={post} />
          ))}

          {hasNextPage && (
            <div className='flex justify-center pt-6'>
              <Button
                variant='ghost'
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
              >
                {isFetchingNextPage ? (
                  <>
                    <IconLoader2 className='mr-2 h-4 w-4 animate-spin' />
                    Loading...
                  </>
                ) : (
                  'Load more'
                )}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
