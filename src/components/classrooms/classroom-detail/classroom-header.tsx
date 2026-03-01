import { Button } from '@/components/ui/button';
import {
  IconBook,
  IconUsers,
  IconCopy,
  IconDotsVertical,
  IconPencil,
  IconInfoCircle,
  IconLogout,
} from '@tabler/icons-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Trash } from 'lucide-react';
import { useDeleteClassroom, useLeaveClassroom } from '@/hooks/use-classrooms';
import { DeleteConfirmDialog } from '@/components/common/delete-confirm-dialog';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Role } from '@/types/auth';
import { RoleGuard } from '@/components/common/role-guard';

interface ClassroomHeaderProps {
  classroom: {
    id: string; // Added id to interface
    name: string;
    section: string;
    classCode: string;
  };
  course: {
    code: string;
    maxStudents: number;
    credits: number;
  };
  enrolledCount: number;
  isTeacher: boolean;
  onCopyClassCode: (code: string) => void;
  onEditClick?: () => void;
  onDetailsClick?: () => void;
}

export function ClassroomHeader({
  classroom,
  course,
  enrolledCount,
  isTeacher,
  onCopyClassCode,
  onEditClick,
  onDetailsClick,
}: ClassroomHeaderProps) {
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [leaveDialogOpen, setLeaveDialogOpen] = useState(false);
  const deleteClassroomMutation = useDeleteClassroom();
  const leaveClassroomMutation = useLeaveClassroom();

  const handleDelete = () => {
    deleteClassroomMutation.mutate(classroom.id, {
      onSuccess: () => {
        setDeleteDialogOpen(false);
        router.push('/dashboard/classrooms');
      },
    });
  };

  const handleLeave = () => {
    leaveClassroomMutation.mutate(classroom.id, {
      onSuccess: () => {
        setLeaveDialogOpen(false);
        router.push('/dashboard/classrooms');
      },
    });
  };
  return (
    <div className='space-y-4'>
      <div className='flex items-start justify-between gap-4'>
        <div className='flex-1 min-w-0'>
          <div className='space-y-1'>
            <h1 className='text-lg sm:text-xl font-semibold truncate leading-none'>
              {classroom.name}
            </h1>
            <p className='text-sm text-muted-foreground'>
              {course.code} • Section {classroom.section}
            </p>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant='ghost'
                size='icon'
                className='text-muted-foreground'
              >
                <IconDotsVertical size={20} />
              </Button>
            }
          />
          <DropdownMenuContent align='end' className='w-48'>
            {isTeacher && (
              <>
                <DropdownMenuItem onClick={onEditClick}>
                  <IconPencil size={18} className='mr-2' />
                  Edit Classroom
                </DropdownMenuItem>
                <DropdownMenuItem
                  variant='destructive'
                  onClick={(e) => {
                    e.preventDefault();
                    setDeleteDialogOpen(true);
                  }}
                >
                  <Trash size={18} className='mr-2' />
                  Delete Classroom
                </DropdownMenuItem>
              </>
            )}

            <RoleGuard allowedRoles={[Role.Student]}>
              <DropdownMenuItem
                variant='destructive'
                onClick={(e) => {
                  e.preventDefault();
                  setLeaveDialogOpen(true);
                }}
              >
                <IconLogout size={18} className='mr-2' />
                Leave Classroom
              </DropdownMenuItem>
            </RoleGuard>

            <DropdownMenuItem onClick={onDetailsClick}>
              <IconInfoCircle size={18} className='mr-2' />
              Class Details
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Quick Stats */}
      {/* <div className='flex items-center gap-6 text-sm'>
        <div className='flex items-center gap-2'>
          <IconUsers size={16} className='text-muted-foreground' />
          <span>
            <strong>{enrolledCount}</strong> / {course.maxStudents} students
          </span>
        </div>
        <div className='flex items-center gap-2'>
          <IconBook size={16} className='text-muted-foreground' />
          <span>{course.credits} credits</span>
        </div>
        <div className='flex items-center gap-2'>
          <code className='font-mono'>{classroom.classCode}</code>
          <Button
            size='icon-xs'
            variant='ghost'
            onClick={() => onCopyClassCode(classroom.classCode)}
            title='Copy class code'
          >
            <IconCopy size={18} />
          </Button>
        </div>
      </div> */}
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title='Delete Classroom'
        description='Are you sure you want to delete this classroom? This action cannot be undone and will remove all students, assignments, and grades associated with it.'
        onConfirm={handleDelete}
        isLoading={deleteClassroomMutation.isPending}
      />

      <DeleteConfirmDialog
        open={leaveDialogOpen}
        onOpenChange={setLeaveDialogOpen}
        title='Leave Classroom'
        description='Are you sure you want to leave this classroom? You will no longer have access to the materials, assignments, or grades.'
        confirmText='Leave'
        onConfirm={handleLeave}
        isLoading={leaveClassroomMutation.isPending}
      />
    </div>
  );
}
