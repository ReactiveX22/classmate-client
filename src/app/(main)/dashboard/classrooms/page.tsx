'use client';

import { useClassrooms } from '@/hooks/use-classrooms';
import { PageHeader } from '@/components/common/page-header';
import { Button } from '@/components/ui/button';
import { IconBook, IconPlus } from '@tabler/icons-react';
import { ClassroomCard } from '@/components/classrooms/classroom-card';
import { ClassroomListSkeleton } from '@/components/classrooms/classroom-list-skeleton';
import { CreateClassroomDialog } from '@/components/classrooms/create-classroom-dialog';
import { JoinClassroomDialog } from '@/components/classrooms/join-classroom-dialog';
import { RoleGuard } from '@/components/common/role-guard';
import { Role } from '@/types/auth';

export default function ClassroomsPage() {
  const {
    data: response,
    isLoading,
    isError,
  } = useClassrooms({
    limit: 50,
  });

  const classrooms = response?.data || [];

  return (
    <div className='flex flex-col gap-4 sm:gap-6 p-4 sm:p-6 max-w-7xl mx-auto w-full'>
      <PageHeader
        title='My Classrooms'
        description='Manage and view all your assigned classrooms'
      >
        <RoleGuard allowedRoles={[Role.Instructor, Role.Admin]}>
          <CreateClassroomDialog />
        </RoleGuard>
        <RoleGuard allowedRoles={[Role.Student]}>
          <JoinClassroomDialog />
        </RoleGuard>
      </PageHeader>

      {isLoading ? (
        <ClassroomListSkeleton />
      ) : isError ? (
        <div className='flex items-center justify-center min-h-[250px] sm:min-h-[400px] border-2 border-dashed rounded-2xl bg-muted/5'>
          <div className='text-center max-w-sm px-4'>
            <div className='bg-destructive/10 size-16 rounded-full flex items-center justify-center mx-auto mb-4'>
              <IconBook className='text-destructive size-8' />
            </div>
            <h3 className='text-xl font-bold mb-2'>Error loading classrooms</h3>
            <p className='text-muted-foreground'>
              We couldn't fetch your classrooms. Please try refreshing the page
              or contact support.
            </p>
          </div>
        </div>
      ) : classrooms.length === 0 ? (
        <div className='flex items-center justify-center min-h-[250px] sm:min-h-[400px] border-2 border-dashed rounded-2xl bg-muted/5'>
          <div className='text-center max-w-sm px-4'>
            <div className='bg-primary/10 size-16 rounded-full flex items-center justify-center mx-auto mb-4'>
              <IconBook className='text-primary size-8' />
            </div>
            <h3 className='text-xl font-bold mb-2'>No classrooms found</h3>
            <div className='text-muted-foreground mb-6'>
              <RoleGuard
                allowedRoles={[Role.Student]}
                fallback={
                  <p>
                    You haven't created any classrooms yet. Start by creating a
                    new one for your students.
                  </p>
                }
              >
                <p>You haven't joined any classrooms yet.</p>
              </RoleGuard>
            </div>
            <RoleGuard allowedRoles={[Role.Instructor, Role.Admin]}>
              <CreateClassroomDialog />
            </RoleGuard>
            <RoleGuard allowedRoles={[Role.Student]}>
              <JoinClassroomDialog />
            </RoleGuard>
          </div>
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6'>
          {classrooms.map((item) => (
            <ClassroomCard key={item.classroom.id} data={item} />
          ))}
        </div>
      )}
    </div>
  );
}
