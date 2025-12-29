import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { usePosts } from '@/hooks/use-posts';
import { IconMessageCircle } from '@tabler/icons-react';
import { CreatePostDialog } from './posts/create-post-dialog';
import { PostList } from './posts/post-list';

interface StreamTabProps {
  classroomId: string;
}

export function StreamTab({ classroomId }: StreamTabProps) {
  const { data, isLoading } = usePosts(classroomId, { limit: 10 });

  const totalPosts =
    data?.pages.reduce((acc, page) => acc + page.data.length, 0) ?? 0;

  const showEmptyState = !isLoading && totalPosts === 0;

  return (
    <div className='space-y-4 mt-6'>
      <div className='flex gap-4 w-full'>
        <Card className='hidden md:block w-64 h-fit shrink-0'>
          <CardHeader>
            <CardTitle className='text-sm'>Upcoming</CardTitle>
          </CardHeader>
          <CardContent className='text-xs text-muted-foreground'>
            No work due soon
          </CardContent>
        </Card>

        <div className='flex-1 max-w-xl space-y-4'>
          <Card className='py-2'>
            <CardHeader className='py-1 items-center'>
              <div className='flex items-center gap-2'>
                <div className='rounded-full bg-primary/10 text-primary p-3'>
                  <IconMessageCircle size={20} />
                </div>
                <div className='flex flex-col'>
                  <h3 className='font-medium text-sm'>
                    Announce something to your class
                  </h3>
                  <p className='text-xs text-muted-foreground'>
                    Share updates, assignments, and materials
                  </p>
                </div>
              </div>

              <CardAction className='my-auto'>
                <CreatePostDialog classroomId={classroomId} />
              </CardAction>
            </CardHeader>
          </Card>

          {showEmptyState ? (
            <Card>
              <CardContent>
                <div className='flex flex-col items-center justify-center py-12 px-4 border-2 border-dashed rounded-lg border-muted'>
                  <IconMessageCircle
                    size={48}
                    className='text-muted-foreground mb-4'
                  />
                  <h3 className='text-lg font-semibold mb-2'>
                    No announcements yet
                  </h3>
                  <p className='text-sm text-muted-foreground text-center'>
                    Share announcements, assignments, and materials with your
                    class
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <PostList classroomId={classroomId} />
          )}
        </div>
      </div>
    </div>
  );
}
