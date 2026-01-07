'use client';

import { AddStudentsToClassroomDialog } from '@/components/classrooms/add-students-to-classroom-dialog';
import { ClassroomDetails } from '@/components/classrooms/classroom-detail/classroom-details-sheet';
import { ClassroomHeader } from '@/components/classrooms/classroom-detail/classroom-header';
import { UpdateClassroomDialog } from '@/components/classrooms/classroom-detail/settings/update-classroom-dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useClassroomTabs } from '@/hooks/use-classroom-tabs';
import { useClassroom } from '@/hooks/use-classrooms';
import { useUser } from '@/hooks/useAuth';
import { parseAsString, useQueryState } from 'nuqs';
import { use, useState } from 'react';
import { toast } from 'sonner';

interface ClassroomPageProps {
  params: Promise<{ id: string }>;
}

export default function ClassroomPage({ params }: ClassroomPageProps) {
  const { id } = use(params);
  const { data, isLoading, isError } = useClassroom(id);
  const { data: user } = useUser();
  const [addStudentsOpen, setAddStudentsOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isDetailsSheetOpen, setIsDetailsSheetOpen] = useState(false);

  const isTeacher = user?.id === data?.teacherId;

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
    <div className='flex flex-col gap-6 p-4'>
      {/* Header Section */}
      <ClassroomHeader
        classroom={data}
        course={data.course}
        enrolledCount={enrolledCount}
        isTeacher={isTeacher || false}
        onCopyClassCode={copyClassCode}
        onEditClick={() => setIsUpdateDialogOpen(true)}
        onDetailsClick={() => setIsDetailsSheetOpen(true)}
      />

      {/* Tabbed Content */}
      <Tabs
        value={tab}
        onValueChange={(value) => setTab(value as string)}
        className='w-full relative'
      >
        <TabsList className='w-full justify-start overflow-x-auto h-auto p-1 bg-muted'>
          {tabs
            .filter((tab) => !tab.hidden)
            .map((tab) => {
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

      {/* Update Classroom Dialog */}
      <UpdateClassroomDialog
        classroom={data}
        open={isUpdateDialogOpen}
        onOpenChange={setIsUpdateDialogOpen}
      />

      {/* Class Details Sheet */}
      <Sheet open={isDetailsSheetOpen} onOpenChange={setIsDetailsSheetOpen}>
        <SheetContent className='data-[side=right]:sm:max-w-xl'>
          <SheetHeader>
            <SheetTitle>Classroom Details</SheetTitle>
          </SheetHeader>
          <ScrollArea className='px-4 max-h-[calc(100vh-5rem)]'>
            <ClassroomDetails
              classroom={data}
              course={data.course}
              onCopyClassCode={copyClassCode}
            />
          </ScrollArea>
        </SheetContent>
      </Sheet>

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
