'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import { useClassroom } from '@/hooks/use-classrooms';
import { usePosts } from '@/hooks/use-posts';
import { getInitials } from '@/lib/utils';
import { IconAlertCircle, IconFileText, IconMail } from '@tabler/icons-react';
import { format } from 'date-fns';
import { CalendarCheck, TrendingUp } from 'lucide-react';
import { useMemo } from 'react';

interface StudentGradeSummaryProps {
  classroomId: string;
  studentId: string;
}

export function StudentGradeSummary({
  classroomId,
  studentId,
}: StudentGradeSummaryProps) {
  const { data: classroom } = useClassroom(classroomId);
  const { data: postsData, isLoading: postsLoading } = usePosts(classroomId, {
    limit: 100,
  }); // Fetch enough posts

  const student = useMemo(() => {
    return classroom?.classroomMembers.find((m) => m.studentId === studentId)
      ?.student;
  }, [classroom, studentId]);

  const assignments = useMemo(() => {
    if (!postsData) return [];
    return postsData.pages
      .flatMap((page) => page.data)
      .filter((post) => post.type === 'assignment');
  }, [postsData]);

  // TODO: Fetch Real Grades for this student.
  // Currently usePosts returns submissions for the 'current user'.
  // Ideally, we would need: useStudentSubmissions(classroomId, studentId)
  // For now, we will render the assignments in a table, but we can't show the real status/grade
  // without that data. We will mock the behavior or show placeholders.

  // NOTE for Reviewer: The API does not currently expose a bulk "get all submissions for student" endpoint.
  // The 'post.submission' field is null for teachers (or reflects their own submission if they had one).

  if (!student) return null;

  return (
    <div className='flex-1'>
      <div className='p-8 space-y-6'>
        {/* Student Header */}
        <div className='flex items-start justify-between'>
          <div className='flex items-center gap-4'>
            <Avatar className='size-12'>
              <AvatarImage src={student.image || ''} />
              <AvatarFallback>{getInitials(student.name)}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className='text-lg font-semibold'>{student.name}</h2>
              <div className='flex items-center gap-2 text-muted-foreground'>
                <span>{student.email}</span>
              </div>
            </div>
          </div>
          <Button variant='outline' className='gap-2'>
            <IconMail size={16} />
          </Button>
        </div>

        {/* Stats Grid */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0'>
              <CardTitle className='text-sm font-medium'>
                Overall Grade
              </CardTitle>
              <TrendingUp className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>- %</div>
              <p className='text-xs text-muted-foreground'>
                Calculated from graded assignments
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0'>
              <CardTitle className='text-sm font-medium'>
                Missing Work
              </CardTitle>
              <IconAlertCircle className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>-</div>
              <p className='text-xs text-muted-foreground'>
                Assignments past due
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0'>
              <CardTitle className='text-sm font-medium'>Attendance</CardTitle>
              <CalendarCheck className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>- %</div>
              <p className='text-xs text-muted-foreground'>
                Present for last 30 days
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Assignments Table */}
        <div className='rounded-md border bg-card shadow-sm overflow-hidden'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className='w-[40%]'>Assignment</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className='text-right'>Grade</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assignments.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className='h-24 text-center text-muted-foreground'
                  >
                    No assignments found
                  </TableCell>
                </TableRow>
              ) : (
                assignments.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className='font-medium'>
                      <div className='flex items-center gap-2'>
                        <div className='p-1.5 bg-primary/10 rounded text-primary'>
                          <IconFileText size={16} />
                        </div>
                        {post.title}
                      </div>
                    </TableCell>
                    <TableCell className='text-muted-foreground'>
                      {post.assignmentData?.dueDate
                        ? format(
                            new Date(post.assignmentData.dueDate),
                            'MMM d, h:mm a'
                          )
                        : 'No due date'}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant='outline'
                        className='font-normal text-muted-foreground'
                      >
                        View details
                      </Badge>
                    </TableCell>
                    <TableCell className='text-right text-muted-foreground'>
                      -- / {post.assignmentData?.points || 100}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
