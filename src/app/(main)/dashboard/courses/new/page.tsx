'use client';

import { useState } from 'react';
import { AddCourseForm } from '@/components/courses/add-course-form';
import { Button } from '@/components/ui/button';
import { FormPageHeader } from '@/components/ui/form-page-header';
import { IconBook } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';

export default function NewCoursePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <div className='flex flex-col min-h-screen'>
      <FormPageHeader
        title='Create New Course'
        description='Add a new course to your organization catalog.'
        icon={<IconBook className='size-5' />}
        backLink='/dashboard/courses'
      >
        <Button
          form='add-course-form'
          type='submit'
          disabled={isSubmitting}
          className='min-w-[100px]'
        >
          {isSubmitting ? 'Creating...' : 'Create Course'}
        </Button>
      </FormPageHeader>

      <main className='flex-1 p-6 md:p-8 max-w-4xl mx-auto w-full'>
        <div className='bg-card border rounded-xl p-6 shadow-sm'>
          <AddCourseForm
            formId='add-course-form'
            onSubmittingChange={setIsSubmitting}
            onSuccess={() => router.push('/dashboard/courses')}
          />
        </div>
      </main>
    </div>
  );
}
