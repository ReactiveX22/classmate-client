'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { getStudentAttendanceStatsQueryOptions } from '@/lib/queryOptions/classroomQueryOptions';
import { Skeleton } from '@/components/ui/skeleton';

interface StudentAttendanceViewProps {
  classroomId: string;
  studentId?: string;
}

export function StudentAttendanceView({
  classroomId,
  studentId,
}: StudentAttendanceViewProps) {
  const {
    data: stats,
    isLoading,
    isError,
  } = useQuery(
    getStudentAttendanceStatsQueryOptions(classroomId, studentId || ''),
  );

  if (isLoading) {
    return (
      <div className='mt-6 space-y-6 max-w-4xl mx-auto'>
        <div className='space-y-1'>
          <Skeleton className='h-8 w-48' />
          <Skeleton className='h-4 w-64' />
        </div>
        <div className='grid gap-6 md:grid-cols-2'>
          <Skeleton className='h-40 w-full' />
          <Skeleton className='h-40 w-full' />
        </div>
      </div>
    );
  }

  if (isError || !stats) {
    return (
      <div className='mt-6 text-center text-muted-foreground'>
        Failed to load attendance statistics.
      </div>
    );
  }

  const isLowAttendance = stats.attendanceRate <= 50;

  return (
    <div className='mt-6 space-y-6 max-w-4xl mx-auto'>
      <div className='space-y-1'>
        <h2 className='text-xl font-semibold tracking-tight'>My Attendance</h2>
        <p className='text-muted-foreground'>
          Track your attendance record and performance
        </p>
      </div>

      <div className='grid gap-6 md:grid-cols-2'>
        {/* Attendance Rate Card */}
        <Card className='shadow-sm border-secondary/50'>
          <CardContent className='flex flex-col justify-center h-full space-y-4 p-6'>
            <div className='space-y-2'>
              <h3 className='text-sm font-medium text-muted-foreground'>
                Attendance Rate
              </h3>
              <div className='flex items-baseline gap-2'>
                <span
                  className={cn(
                    'text-3xl font-semibold tracking-tight',
                    isLowAttendance && 'text-destructive',
                  )}
                >
                  {stats.attendanceRate}%
                </span>
                <span className='text-sm text-muted-foreground'>
                  ({stats.present + stats.late} of {stats.total} classes)
                </span>
              </div>
            </div>
            <Progress
              value={stats.attendanceRate}
              className={cn(
                isLowAttendance &&
                  '**:data-[slot=progress-indicator]:bg-destructive',
              )}
            />
          </CardContent>
        </Card>

        {/* Breakdown Card */}
        <Card className='shadow-sm border-secondary/50'>
          <CardContent className='flex flex-col justify-center h-full gap-3 p-6'>
            <div className='flex items-center justify-between'>
              <span className='text-sm font-medium text-muted-foreground'>
                Present
              </span>
              <div className='flex items-center gap-3'>
                <div className='size-2.5 rounded-full bg-emerald-500 shadow-[0_0_0_2px_rgba(16,185,129,0.2)]' />
                <span className='font-bold min-w-6 text-right'>
                  {stats.present}
                </span>
              </div>
            </div>
            <div className='flex items-center justify-between'>
              <span className='text-sm font-medium text-muted-foreground'>
                Late
              </span>
              <div className='flex items-center gap-3'>
                <div className='size-2.5 rounded-full bg-amber-500 shadow-[0_0_0_2px_rgba(245,158,11,0.2)]' />
                <span className='font-bold min-w-6 text-right'>
                  {stats.late}
                </span>
              </div>
            </div>
            <div className='flex items-center justify-between'>
              <span className='text-sm font-medium text-muted-foreground'>
                Absent
              </span>
              <div className='flex items-center gap-3'>
                <div className='size-2.5 rounded-full bg-red-500 shadow-[0_0_0_2px_rgba(239,68,68,0.2)]' />
                <span className='font-bold min-w-6 text-right'>
                  {stats.absent}
                </span>
              </div>
            </div>
            {stats.excused > 0 && (
              <div className='flex items-center justify-between border-t pt-2 mt-1'>
                <span className='text-sm font-medium text-muted-foreground'>
                  Excused
                </span>
                <div className='flex items-center gap-3'>
                  <div className='size-2.5 rounded-full bg-blue-500 shadow-[0_0_0_2px_rgba(59,130,246,0.2)]' />
                  <span className='font-bold min-w-6 text-right'>
                    {stats.excused}
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
