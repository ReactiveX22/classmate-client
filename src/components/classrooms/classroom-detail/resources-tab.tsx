'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { usePosts } from '@/hooks/use-posts';
import { IconBook, IconLoader2, IconPlus } from '@tabler/icons-react';
import { useMemo } from 'react';
import { CreatePostDialog } from './posts/create-post-dialog';
import { MaterialCard } from './posts/post-types/material-card';
import { RoleGuard } from '@/components/common/role-guard';
import { Role } from '@/types/auth';

interface ResourcesTabProps {
  classroomId: string;
}

export function ResourcesTab({ classroomId }: ResourcesTabProps) {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    usePosts(classroomId, { limit: 20 });

  const materials = useMemo(() => {
    if (!data) return [];
    // Flatten pages and filter only materials
    return data.pages
      .flatMap((page) => page.data)
      .filter((post) => post.type === 'material');
  }, [data]);

  const isEmpty = !isLoading && materials.length === 0;

  return (
    <div className='max-w-3xl mx-auto space-y-4 pb-12 sm:pb-20'>
      <div className='flex items-center justify-end mb-4'>
        <RoleGuard allowedRoles={[Role.Instructor]}>
          <CreatePostDialog
            classroomId={classroomId}
            trigger={
              <Button className='gap-2 shadow-sm mt-4'>
                <IconPlus size={18} />
                <span>Add</span>
              </Button>
            }
          />
        </RoleGuard>
      </div>

      {isLoading ? (
        <div className='flex justify-center py-12'>
          <IconLoader2 className='animate-spin text-muted-foreground' />
        </div>
      ) : isEmpty ? (
        <Card className='border-dashed shadow-none bg-muted/30'>
          <CardContent className='flex flex-col items-center justify-center py-16 text-center'>
            <div className='p-4 bg-background rounded-full mb-4 shadow-sm'>
              <IconBook className='w-8 h-8 text-muted-foreground' />
            </div>
            <h3 className='text-lg font-medium mb-1'>No materials yet</h3>
            <p className='text-muted-foreground text-sm max-w-sm mx-auto mb-6'>
              Materials you create will appear here. Students can view and
              download resources.
            </p>
            <CreatePostDialog
              classroomId={classroomId}
              trigger={<Button variant='outline'>Create material</Button>}
            />
          </CardContent>
        </Card>
      ) : (
        <div className='space-y-4'>
          {materials.map((post) => (
            <MaterialCard key={post.id} post={post} />
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
