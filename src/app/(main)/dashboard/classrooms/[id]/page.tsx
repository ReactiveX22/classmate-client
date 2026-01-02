'use client';

import { AddStudentsToClassroomDialog } from '@/components/classrooms/add-students-to-classroom-dialog';
import { ClassroomHeader } from '@/components/classrooms/classroom-detail/classroom-header';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useClassroomTabs } from '@/hooks/use-classroom-tabs';
import { useClassroom } from '@/hooks/use-classrooms';
import { parseAsString, useQueryState } from 'nuqs';
import { use, useState } from 'react';
import { toast } from 'sonner';

interface ClassroomPageProps {
  params: Promise<{ id: string }>;
}

export default function ClassroomPage({ params }: ClassroomPageProps) {
  const { id } = use(params);
  const { data, isLoading, isError } = useClassroom(id);
  const [addStudentsOpen, setAddStudentsOpen] = useState(false);

  const [tab, setTab] = useQueryState(
    'tab',
    parseAsString.withDefault('stream')
  );

  const copyClassCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success('Class code copied to clipboard!');
  };

  const classroom = data;
  const course = data?.course;
  const teacher = data?.teacher;
  const classroomMembers = data?.classroomMembers || [];
  const enrolledCount = classroomMembers.length;

  const tabs = useClassroomTabs({
    classroom,
    course,
    teacher,
    classroomMembers,
    enrolledCount,
    onAddStudents: () => setAddStudentsOpen(true),
    onCopyClassCode: copyClassCode,
  });

  if (isLoading) {
    return (
      <div className='flex flex-col gap-6 p-6'>
        <div className='space-y-2'>
          <Skeleton className='h-8 w-64' />
          <Skeleton className='h-4 w-96' />
        </div>
        <Skeleton className='h-10 w-full max-w-md' />
        <div className='space-y-4'>
          <Skeleton className='h-32 w-full' />
          <Skeleton className='h-32 w-full' />
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className='flex flex-col gap-6 p-6'>
        <div className='flex items-center justify-center h-64'>
          <div className='text-center'>
            <p className='text-destructive text-lg font-medium'>
              Error loading classroom
            </p>
            <p className='text-muted-foreground mt-2'>
              Please try again later or contact support if the problem persists.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-6 p-6'>
      {/* Header Section */}
      <ClassroomHeader
        classroom={data}
        course={data.course}
        enrolledCount={enrolledCount}
        onCopyClassCode={copyClassCode}
      />

      {/* Tabbed Content */}
      <Tabs
        value={tab}
        onValueChange={(value) => setTab(value as string)}
        className='w-full relative'
      >
        <TabsList className='w-full justify-start overflow-x-auto h-auto p-1 bg-muted'>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className='gap-2 py-2 px-4 data-[state=active]:bg-background data-[state=active]:shadow-sm'
              >
                <Icon size={16} />
                <span className='whitespace-nowrap'>{tab.label}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {tabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value} className='mt-0'>
            {tab.content}
          </TabsContent>
        ))}
      </Tabs>

      {/* Add Students Dialog */}
      <AddStudentsToClassroomDialog
        open={addStudentsOpen}
        onOpenChange={setAddStudentsOpen}
        classroomId={data.id}
        classroomName={data.name}
        existingStudentIds={data.classroomMembers.map((m) => m.studentId)}
      />
    </div>
  );
}
