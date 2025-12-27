'use client';

import { useClassrooms } from '@/hooks/use-classrooms';
import { PageHeader } from '@/components/common/page-header';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import {
  IconBook,
  IconUsers,
  IconCalendar,
  IconClock,
  IconChevronRight,
} from '@tabler/icons-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function ClassroomsPage() {
  const {
    data: response,
    isLoading,
    isError,
  } = useClassrooms({
    limit: 50,
  });

  const classrooms = response?.data || [];

  if (isLoading) {
    return (
      <div className='flex flex-col gap-6 p-6'>
        <PageHeader
          title='My Classrooms'
          description='Manage and view all your classrooms'
        />
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className='h-6 w-3/4' />
                <Skeleton className='h-4 w-1/2 mt-2' />
              </CardHeader>
              <CardContent>
                <Skeleton className='h-20 w-full' />
              </CardContent>
              <CardFooter>
                <Skeleton className='h-10 w-full' />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className='flex flex-col gap-6 p-6'>
        <PageHeader
          title='My Classrooms'
          description='Manage and view all your classrooms'
        />
        <div className='flex items-center justify-center h-64'>
          <div className='text-center'>
            <p className='text-destructive text-lg font-medium'>
              Error loading classrooms
            </p>
            <p className='text-muted-foreground mt-2'>
              Please try again later or contact support if the problem persists.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (classrooms.length === 0) {
    return (
      <div className='flex flex-col gap-6 p-6'>
        <PageHeader
          title='My Classrooms'
          description='Manage and view all your classrooms'
        />
        <div className='flex items-center justify-center h-64'>
          <div className='text-center'>
            <IconBook
              size={64}
              className='mx-auto text-muted-foreground mb-4'
            />
            <p className='text-lg font-medium'>No classrooms yet</p>
            <p className='text-muted-foreground mt-2'>
              Create your first classroom to get started.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-6 p-6'>
      <PageHeader
        title='My Classrooms'
        description='Manage and view all your classrooms'
      />

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {classrooms.map((item) => {
          const { classroom, course } = item;

          // Generate dummy data for fields not yet provided by API
          const studentCount = Math.floor(Math.random() * 30) + 10; // Random 10-40
          const maxStudents = course.maxStudents || 50;
          const recentActivity = '2 hours ago'; // Placeholder

          return (
            <Card
              key={classroom.id}
              className='hover:shadow-md transition-shadow'
            >
              <CardHeader>
                <div className='flex items-start justify-between gap-2'>
                  <div className='flex-1 min-w-0'>
                    <CardTitle className='truncate'>{classroom.name}</CardTitle>
                    <CardDescription className='mt-1'>
                      {course.code} • {classroom.section}
                    </CardDescription>
                  </div>
                  <Badge
                    variant={
                      classroom.status === 'active' ? 'default' : 'secondary'
                    }
                  >
                    {classroom.status}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className='space-y-4'>
                <div>
                  <p className='text-sm font-medium mb-1'>Course</p>
                  <p className='text-sm text-muted-foreground'>
                    {course.title}
                  </p>
                </div>

                {classroom.description && (
                  <div>
                    <p className='text-sm font-medium mb-1'>Description</p>
                    <p className='text-sm text-muted-foreground line-clamp-2'>
                      {classroom.description}
                    </p>
                  </div>
                )}

                <div className='flex items-center gap-4 text-sm text-muted-foreground'>
                  <div className='flex items-center gap-1'>
                    <IconUsers size={16} />
                    <span>
                      {studentCount}/{maxStudents}
                    </span>
                  </div>
                  <div className='flex items-center gap-1'>
                    <IconBook size={16} />
                    <span>{course.credits} credits</span>
                  </div>
                </div>

                <div className='flex items-center gap-2 text-xs text-muted-foreground'>
                  <IconClock size={14} />
                  <span>Last activity: {recentActivity}</span>
                </div>

                <div className='pt-2 border-t'>
                  <div className='flex items-center justify-between text-xs'>
                    <span className='text-muted-foreground'>Class Code</span>
                    <code className='px-2 py-1 bg-muted rounded font-mono font-semibold'>
                      {classroom.classCode}
                    </code>
                  </div>
                </div>
              </CardContent>

              <CardFooter className='border-t'>
                <Button
                  render={
                    <Link href={`/dashboard/classrooms/${classroom.id}`} />
                  }
                  className='w-full'
                  variant='outline'
                >
                  View Classroom
                  <IconChevronRight size={16} />
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
