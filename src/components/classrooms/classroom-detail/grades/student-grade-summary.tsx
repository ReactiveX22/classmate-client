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
import { useClassroom, useStudentGradeStats } from '@/hooks/use-classrooms';
import { getInitials } from '@/lib/utils';
import { IconAlertCircle, IconCheck, IconFileText } from '@tabler/icons-react';
import { format } from 'date-fns';
import { CalendarCheck, TrendingUp } from 'lucide-react';
import { useRouter } from 'next/navigation';
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
  const { data: gradeStatsData, isLoading } = useStudentGradeStats(
    classroomId,
    studentId,
  );

  const student = useMemo(() => {
    return classroom?.classroomMembers.find((m) => m.studentId === studentId)
      ?.student;
  }, [classroom, studentId]);

  if (!student) return null;

  const { assignments, gradeStats } = gradeStatsData || {
    assignments: [],
    gradeStats: { overall_grade: 0, missing_work: 0, attendance: 0 },
  };

  const router = useRouter();

  return (
    <div className='flex-1'>
      <div className='p-4 sm:p-8 space-y-4 sm:space-y-6'>
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
              <div className='text-2xl font-bold'>
                {isLoading ? '-' : `${gradeStats.overall_grade}%`}
              </div>
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
              <div className='text-2xl font-bold'>
                {isLoading ? '-' : gradeStats.missing_work}
              </div>
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
              <div className='text-2xl font-bold'>
                {isLoading ? '-' : `${gradeStats.attendance}%`}
              </div>
              <p className='text-xs text-muted-foreground'>
                Present of total classes
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Assignments Table */}
        <div className='rounded-md border bg-card shadow-sm overflow-x-auto'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Assignment</TableHead>
                <TableHead className='hidden sm:table-cell'>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className='hidden sm:table-cell'>
                  Turned In
                </TableHead>
                <TableHead className='text-right'>Grade</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assignments.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className='h-24 text-center text-muted-foreground'
                  >
                    No assignments found
                  </TableCell>
                </TableRow>
              ) : (
                assignments.map((post: any) => {
                  const submission = post.submissions?.[0];
                  return (
                    <TableRow
                      key={post.id}
                      className='cursor-pointer hover:bg-muted/50 transition-colors group'
                      onClick={() =>
                        router.push(
                          `/dashboard/classrooms/${classroomId}/assignments/${post.id}`,
                        )
                      }
                    >
                      <TableCell className='font-medium'>
                        <div className='flex items-center gap-2 group-hover:text-primary transition-colors'>
                          <div className='p-1.5 bg-primary/10 rounded text-primary'>
                            <IconFileText size={16} />
                          </div>
                          {post.title}
                        </div>
                      </TableCell>
                      <TableCell className='text-muted-foreground hidden sm:table-cell'>
                        {post.assignmentData?.dueDate
                          ? format(
                              new Date(post.assignmentData.dueDate),
                              'MMM d, h:mm a',
                            )
                          : 'No due date'}
                      </TableCell>
                      <TableCell>
                        {(() => {
                          const status = submission?.status;
                          if (!status || status === 'assigned') {
                            return (
                              <Badge
                                variant='outline'
                                className='text-muted-foreground font-normal bg-transparent border-dashed'
                              >
                                Assigned
                              </Badge>
                            );
                          }

                          switch (status) {
                            case 'turned_in':
                              return (
                                <Badge
                                  variant='secondary'
                                  className='bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400 gap-1'
                                >
                                  <IconCheck size={14} />
                                  Turned in
                                </Badge>
                              );
                            case 'graded':
                              return (
                                <Badge
                                  variant='secondary'
                                  className='bg-purple-100 text-purple-700 hover:bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400 gap-1'
                                >
                                  <IconCheck size={14} />
                                  Graded
                                </Badge>
                              );
                            case 'returned':
                              return (
                                <Badge
                                  variant='secondary'
                                  className='bg-gray-100 text-gray-700 hover:bg-gray-100 dark:bg-gray-900/30 dark:text-gray-400 gap-1'
                                >
                                  <IconCheck size={14} />
                                  Returned
                                </Badge>
                              );
                            default:
                              return (
                                <Badge
                                  variant='outline'
                                  className='font-normal'
                                >
                                  {status.replace('_', ' ')}
                                </Badge>
                              );
                          }
                        })()}
                      </TableCell>
                      <TableCell className='hidden sm:table-cell'>
                        {(() => {
                          const date = submission?.submittedAt;
                          const status = submission?.status;
                          const dueDate = post.assignmentData?.dueDate;

                          if (
                            status === 'turned_in' ||
                            status === 'graded' ||
                            (date && status !== 'assigned')
                          ) {
                            const isLate =
                              dueDate &&
                              date &&
                              new Date(date) > new Date(dueDate);

                            return (
                              <div className='flex items-center gap-2'>
                                <span className='text-sm text-muted-foreground'>
                                  {date
                                    ? format(new Date(date), 'MMM d, p')
                                    : '-'}
                                </span>
                                {isLate && (
                                  <Badge variant='destructive'>Late</Badge>
                                )}
                              </div>
                            );
                          }
                          return (
                            <span className='text-sm text-muted-foreground'>
                              -
                            </span>
                          );
                        })()}
                      </TableCell>
                      <TableCell className='text-right text-muted-foreground'>
                        {submission?.grade !== null &&
                        submission?.grade !== undefined
                          ? submission.grade
                          : '-'}
                        {' / '}
                        {post.assignmentData?.points || 100}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
