'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { usePosts } from '@/hooks/use-posts';
import { Post } from '@/lib/api/services/post.service';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import {
  IconAlertCircle,
  IconCheck,
  IconClock,
  IconFileText,
  IconLoader2,
} from '@tabler/icons-react';
import { useMemo } from 'react';
import { useRouter } from 'next/navigation';

interface GradesTabProps {
  classroomId: string;
}

export function GradesTab({ classroomId }: GradesTabProps) {
  const router = useRouter();
  // Fetch all posts to find assignments
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    usePosts(classroomId, { limit: 50 }); // Fetch more to likely get all assignments at once

  const assignments = useMemo(() => {
    if (!data) return [];
    return data.pages
      .flatMap((page) => page.data)
      .filter((post) => post.type === 'assignment');
  }, [data]);

  const isEmpty = !isLoading && assignments.length === 0;

  // Helper to determine status and color
  const getStatusDetails = (post: Post) => {
    const submission = post.submission;
    const dueDate = post.assignmentData?.dueDate
      ? new Date(post.assignmentData.dueDate)
      : null;
    const isPastDue = dueDate && new Date() > dueDate;

    if (!submission) {
      if (isPastDue) {
        return {
          label: 'Missing',
          color: 'destructive',
          icon: IconAlertCircle,
        };
      }
      return { label: 'Assigned', color: 'secondary', icon: IconFileText };
    }

    switch (submission.status) {
      case 'turned_in':
        return { label: 'Turned In', color: 'default', icon: IconCheck }; // Greenish via class
      case 'graded':
        return { label: 'Graded', color: 'outline', icon: IconCheck };
      case 'returned':
        return { label: 'Returned', color: 'outline', icon: IconCheck };
      case 'assigned':
      default:
        if (isPastDue) {
          return {
            label: 'Missing',
            color: 'destructive',
            icon: IconAlertCircle,
          };
        }
        return { label: 'Assigned', color: 'secondary', icon: IconFileText };
    }
  };

  const calculateGradeDisplay = (post: Post) => {
    const submission = post.submission;
    const maxPoints = post.assignmentData?.points;

    if (
      !submission ||
      submission.grade === undefined ||
      submission.grade === null
    ) {
      if (!maxPoints) return 'No grade';
      return `__ / ${maxPoints}`;
    }

    return (
      <span className='font-semibold'>
        {submission.grade}
        <span className='text-muted-foreground font-normal'>
          {' '}
          / {maxPoints}
        </span>
      </span>
    );
  };

  const handleRowClick = (postId: string) => {
    router.push(`/dashboard/classrooms/${classroomId}/assignments/${postId}`);
  };

  if (isLoading) {
    return (
      <div className='flex justify-center py-12'>
        <IconLoader2 className='animate-spin text-muted-foreground' />
      </div>
    );
  }

  if (isEmpty) {
    return (
      <Card className='border-dashed shadow-none bg-muted/30 max-w-4xl mx-auto'>
        <CardContent className='flex flex-col items-center justify-center py-16 text-center'>
          <div className='p-4 bg-background rounded-full mb-4 shadow-sm'>
            <IconFileText className='w-8 h-8 text-muted-foreground' />
          </div>
          <h3 className='text-lg font-medium mb-1'>No work due</h3>
          <p className='text-muted-foreground text-sm max-w-sm mx-auto'>
            When your teacher assigns work, it will show up here nicely
            organized for you.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Calculate stats
  const totalAssignments = assignments.length;
  const completedAssignments = assignments.filter(
    (a) =>
      a.submission?.status === 'turned_in' ||
      a.submission?.status === 'graded' ||
      a.submission?.status === 'returned'
  ).length;
  const overallProgress =
    Math.round((completedAssignments / totalAssignments) * 100) || 0;

  return (
    <div className='flex flex-col md:flex-row gap-6 mt-6 pb-20'>
      {/* Stats Sidebar */}
      <div className='w-full md:w-64 shrink-0 space-y-4'>
        <Card className='gap-1.5'>
          <CardHeader>
            <CardTitle className='text-sm text-muted-foreground'>
              Completion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-lg font-medium mb-1'>{overallProgress}%</div>
            <p className='text-xs text-muted-foreground'>
              {completedAssignments} of {totalAssignments} assignments finished
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className='w-3xl space-y-4'>
        <div className='rounded-md border bg-card shadow-sm overflow-hidden'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className='w-[40%] text-muted-foreground'>
                  Classwork
                </TableHead>
                <TableHead className='text-muted-foreground'>
                  Due Date
                </TableHead>
                <TableHead className='text-muted-foreground'>Status</TableHead>
                <TableHead className='text-muted-foreground'>
                  Submitted
                </TableHead>
                <TableHead className='text-right text-muted-foreground'>
                  Grade
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assignments.map((post) => {
                const status = getStatusDetails(post);
                const isMissing = status.label === 'Missing';
                const StatusIcon = status.icon;

                return (
                  <TableRow
                    key={post.id}
                    className='cursor-pointer hover:bg-muted/50 transition-colors'
                    onClick={() => handleRowClick(post.id)}
                  >
                    <TableCell className='font-medium'>
                      <div className='flex items-center gap-3'>
                        <div className='p-2 bg-primary/10 rounded-md text-primary'>
                          <IconFileText size={18} />
                        </div>
                        <span className='max-w-[200px] font-semibold text-foreground/90 line-clamp-1 truncate'>
                          {post.title || 'Untitled Assignment'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {post.assignmentData?.dueDate ? (
                        <div
                          className={cn(
                            'text-sm',
                            isMissing
                              ? 'text-destructive font-medium'
                              : 'text-muted-foreground'
                          )}
                        >
                          {format(
                            new Date(post.assignmentData.dueDate),
                            'MMM d, h:mm a'
                          )}
                        </div>
                      ) : (
                        <span className='text-muted-foreground text-sm'>
                          No due date
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          status.color as
                            | 'default'
                            | 'secondary'
                            | 'destructive'
                            | 'outline'
                        }
                        className='gap-1.5 px-2.5 py-0.5'
                      >
                        <StatusIcon size={12} />
                        {status.label}
                      </Badge>
                    </TableCell>
                    <TableCell className='text-muted-foreground text-sm'>
                      {post.submission?.submittedAt
                        ? format(new Date(post.submission.submittedAt), 'MMM d')
                        : '-'}
                    </TableCell>
                    <TableCell className='text-right'>
                      {calculateGradeDisplay(post)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {hasNextPage && (
          <div className='flex justify-center pt-4'>
            <Button
              variant='ghost'
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className='text-muted-foreground'
            >
              {isFetchingNextPage ? (
                <>
                  <IconLoader2 className='mr-2 h-4 w-4 animate-spin' />
                  Loading older assignments...
                </>
              ) : (
                'Load more'
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
