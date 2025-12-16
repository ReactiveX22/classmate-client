'use client';

import { AddTeacherDialog } from '@/components/teachers/add-teacher-dialog';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function TeachersPage() {
  return (
    <div className='flex flex-col gap-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Teachers</h1>
          <p className='text-muted-foreground'>
            Manage your school's teachers and instructors.
          </p>
        </div>
        <AddTeacherDialog />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Teachers</CardTitle>
          <CardDescription>
            A list of all teachers in your organization.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='flex h-[200px] items-center justify-center rounded-md border border-dashed'>
            <p className='text-muted-foreground text-sm'>
              Teacher list table will be implemented here.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
