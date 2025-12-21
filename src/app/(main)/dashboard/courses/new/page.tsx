'use client';

import { AddCourseForm } from '@/components/courses/add-course-form';
import { Button } from '@/components/ui/button';
import { IconChevronLeft } from '@tabler/icons-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NewCoursePage() {
  const router = useRouter();

  return (
    <div className='flex flex-col gap-6 p-6 max-w-2xl mx-auto'>
      <div className='flex items-center gap-4'>
        <Button
          variant='ghost'
          size='icon'
          render={<Link href='/dashboard/courses' />}
          className='-ml-2'
        >
          <IconChevronLeft className='size-5' />
        </Button>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>
            Create New Course
          </h1>
          <p className='text-muted-foreground'>
            Fill in the details below to add a new course to your organization.
          </p>
        </div>
      </div>

      <div className='bg-card border rounded-lg p-6'>
        <AddCourseForm onSuccess={() => router.push('/dashboard/courses')} />
      </div>
    </div>
  );
}
