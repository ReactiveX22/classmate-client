import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { IconMessageCircle } from '@tabler/icons-react';
import { PostList } from './posts/post-list';
import { usePosts } from '@/hooks/use-posts';

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
      {showEmptyState ? (
        <Card>
          <CardHeader>
            <CardTitle>Class Stream</CardTitle>
            <CardDescription>
              Announcements and updates will appear here
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='flex flex-col items-center justify-center py-12 px-4 border-2 border-dashed rounded-lg'>
              <IconMessageCircle
                size={48}
                className='text-muted-foreground mb-4'
              />
              <h3 className='text-lg font-semibold mb-2'>
                No announcements yet
              </h3>
              <p className='text-sm text-muted-foreground text-center mb-4'>
                Share announcements, assignments, and materials with your class
              </p>
              <Button disabled>
                <IconMessageCircle className='mr-2 h-4 w-4' />
                Create Announcement
              </Button>
              <p className='text-xs text-muted-foreground mt-2'>Coming soon</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className='flex gap-4'>
          <Card className='w-64 h-fit'>
            <CardHeader>
              <CardTitle>Upcoming</CardTitle>
            </CardHeader>
            <CardContent>No work due soon</CardContent>
          </Card>
          <PostList classroomId={classroomId} />
        </div>
      )}
    </div>
  );
}
