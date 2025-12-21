'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import { FormPageHeader } from '@/components/ui/form-page-header';
import {
  BookOpen,
  Users,
  UserPen,
  Calendar,
  Clock,
  GraduationCap,
  Plus,
  BookMarked,
  Code,
  Book,
} from 'lucide-react';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useCourse, useUpdateCourse } from '@/hooks/use-courses';
import { IconUsers, IconUserPlus } from '@tabler/icons-react';
import { AssignTeacherDialog } from '@/components/courses/assign-teacher-dialog';
import { AssignStudentDialog } from '@/components/courses/assign-student-dialog';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();
};

export default function CourseDetailsPage() {
  const { id } = useParams();
  const { data: course, isLoading, isError } = useCourse(id as string);
  const updateCourseMutation = useUpdateCourse();

  const [showAssignTeacher, setShowAssignTeacher] = React.useState(false);
  const [showAssignStudent, setShowAssignStudent] = React.useState(false);

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <div className='flex flex-col items-center gap-4'>
          <div className='size-8 animate-spin rounded-full border-4 border-primary border-t-transparent' />
          <p className='text-muted-foreground animate-pulse'>
            Loading course details...
          </p>
        </div>
      </div>
    );
  }

  if (isError || !course) {
    return (
      <div className='p-8 flex flex-col items-center justify-center min-h-[400px] space-y-4'>
        <div className='size-12 rounded-full bg-destructive/10 flex items-center justify-center'>
          <BookOpen className='size-6 text-destructive' />
        </div>
        <div className='text-center'>
          <h3 className='text-lg font-semibold'>Course Not Found</h3>
          <p className='text-muted-foreground'>
            The course you are looking for does not exist or has been removed.
          </p>
        </div>
        <Button variant='outline' onClick={() => window.history.back()}>
          Go Back
        </Button>
      </div>
    );
  }

  const teacher = course.teacher;
  const enrollments = course.enrollment || [];

  return (
    <div className='flex flex-col min-h-screen bg-muted/30'>
      <FormPageHeader
        title={course.title}
        description={`${course.code} • ${course.semester}`}
        icon={<BookOpen className='size-4' />}
        backLink='/dashboard/courses'
      >
        <Button size='sm' className='gap-2'>
          <BookMarked className='size-4' /> Syllabus
        </Button>
      </FormPageHeader>

      <main className='flex-1 p-4 md:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto w-full'>
        {/* Course Overview Grid */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <Card className='md:col-span-2 shadow-sm border-none ring-1 ring-border'>
            <CardHeader>
              <div className='flex justify-between items-start'>
                <div className='space-y-1'>
                  <CardTitle className='text-lg'>{course.title}</CardTitle>
                  <CardDescription className='text-sm max-w-xl'>
                    {course.description || 'No description available.'}
                  </CardDescription>
                </div>
                <Badge
                  className={cn(
                    'capitalize',
                    course.status === 'active'
                      ? 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 border-amber-500/20'
                  )}
                >
                  {course.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className='grid grid-cols-2 lg:grid-cols-4 gap-6'>
              <div className='space-y-1'>
                <p className='text-xs font-medium text-muted-foreground uppercase tracking-wider'>
                  Code
                </p>
                <div className='flex items-center gap-2'>
                  <Book className='size-4 text-primary' />
                  <span className='font-semibold text-lg'>{course.code}</span>
                </div>
              </div>
              <div className='space-y-1'>
                <p className='text-xs font-medium text-muted-foreground uppercase tracking-wider'>
                  Credits
                </p>
                <div className='flex items-center gap-2'>
                  <GraduationCap className='size-4 text-primary' />
                  <span className='font-semibold text-lg'>
                    {course.credits} Units
                  </span>
                </div>
              </div>
              <div className='space-y-1'>
                <p className='text-xs font-medium text-muted-foreground uppercase tracking-wider'>
                  Capacity
                </p>
                <div className='flex items-center gap-2'>
                  <Users className='size-4 text-primary' />
                  <span className='font-semibold text-lg'>
                    {enrollments.length}/{course.maxStudents} Students
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Assigned Teacher Card */}
          <Card className='border-none shadow-sm ring-1 ring-border flex flex-col'>
            <CardHeader>
              <CardTitle className='text-base'>Instructor</CardTitle>
              <CardAction>
                <Button
                  variant='secondary'
                  size='icon-sm'
                  className='h-8 w-8'
                  onClick={() => setShowAssignTeacher(true)}
                >
                  <UserPen className='size-4' />
                </Button>
              </CardAction>
            </CardHeader>
            <CardContent>
              {teacher ? (
                <div className='flex items-center gap-4'>
                  <Avatar className='size-16 border-2 border-background ring-2 ring-primary/10'>
                    <AvatarImage
                      src={teacher.user.image || undefined}
                      alt={teacher.user.name}
                    />
                    <AvatarFallback className='text-xl'>
                      {getInitials(teacher.user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className='min-w-0'>
                    <h3 className='font-semibold truncate'>
                      {teacher.user.name}
                    </h3>
                    <p className='text-sm text-muted-foreground truncate'>
                      {teacher.title || 'Instructor'}
                    </p>
                    <p className='text-xs text-primary mt-1 truncate'>
                      {teacher.user.email}
                    </p>
                  </div>
                </div>
              ) : (
                <div className='flex flex-col items-center py-4 gap-4'>
                  <div className='size-12 rounded-full bg-muted flex items-center justify-center'>
                    <IconUserPlus className='size-6 text-muted-foreground/50' />
                  </div>
                  <div className='text-center space-y-1'>
                    <p className='text-sm font-medium'>No teacher assigned</p>
                    <p className='text-xs text-muted-foreground'>
                      Assign a teacher to lead this course.
                    </p>
                  </div>
                  <Button
                    variant='outline'
                    size='sm'
                    className='w-full'
                    onClick={() => setShowAssignTeacher(true)}
                  >
                    Assign Teacher
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Students Section */}
        <Card className='shadow-sm border-none ring-1 ring-border'>
          <CardHeader>
            <CardTitle>Enrolled Students</CardTitle>
            <CardDescription>
              Currently {enrollments.length} students enrolled in this course.
            </CardDescription>
            <CardAction>
              <Button size='sm' onClick={() => setShowAssignStudent(true)}>
                <Plus className='size-4' /> Assign Students
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            {enrollments.length > 0 ? (
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
                {enrollments.map((en) => (
                  <div
                    key={en.studentId}
                    className='flex items-center gap-4 p-4 rounded-xl border bg-card hover:bg-accent/50 transition-all cursor-default group'
                  >
                    <Avatar className='h-10 w-10 shrink-0 border'>
                      <AvatarImage
                        src={en.student.user.image || undefined}
                        alt={en.student.user.name}
                      />
                      <AvatarFallback>
                        {getInitials(en.student.user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className='min-w-0 flex-1'>
                      <p className='text-sm font-semibold truncate group-hover:text-primary transition-colors'>
                        {en.student.user.name}
                      </p>
                      <p className='text-xs text-muted-foreground truncate'>
                        {en.student.studentId || 'No ID'}
                      </p>
                    </div>
                  </div>
                ))}

                {/* Enrollment Slot Card */}
                {enrollments.length < course.maxStudents && (
                  <div
                    className='flex items-center justify-center border-2 border-dashed rounded-xl p-4 hover:bg-accent/30 hover:border-primary/50 transition-all cursor-pointer group'
                    onClick={() => setShowAssignStudent(true)}
                  >
                    <div className='flex flex-col items-center gap-1'>
                      <Plus className='size-5 text-muted-foreground group-hover:text-primary transition-colors' />
                      <span className='text-xs font-medium text-muted-foreground group-hover:text-primary transition-colors'>
                        Add Student
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className='flex flex-col items-center justify-center py-12 border-2 border-dashed rounded-xl space-y-4'>
                <div className='size-12 rounded-full bg-muted flex items-center justify-center'>
                  <Users className='size-6 text-muted-foreground/50' />
                </div>
                <div className='text-center space-y-1'>
                  <p className='font-medium'>No students enrolled yet</p>
                  <p className='text-sm text-muted-foreground'>
                    Start by enrolling students into this course.
                  </p>
                </div>
                <Button size='sm' onClick={() => setShowAssignStudent(true)}>
                  Assign Students
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <AssignTeacherDialog
        open={showAssignTeacher}
        onOpenChange={setShowAssignTeacher}
        courseTitle={course.title}
      />

      <AssignStudentDialog
        open={showAssignStudent}
        onOpenChange={setShowAssignStudent}
        courseTitle={course.title}
        enrolledStudentIds={course.enrollment?.map((e) => e.studentId) || []}
      />
    </div>
  );
}
