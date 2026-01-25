import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useRemoveStudentsFromClassroom } from '@/hooks/use-classrooms';
import { getInitials } from '@/lib/utils';
import {
  IconLoader2,
  IconMessage,
  IconUserPlus,
  IconUsers,
  IconUserX,
} from '@tabler/icons-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { DeleteConfirmDialog } from '@/components/common/delete-confirm-dialog';
import { RoleGuard } from '@/components/common/role-guard';
import { Role } from '@/types/auth';

interface Teacher {
  name: string;
  email: string;
}

interface Student {
  name: string;
  email: string;
}

interface ClassroomMember {
  studentId: string;
  student: Student;
  joinedAt: string;
}

interface PeopleTabProps {
  classroomId: string;
  teacher: Teacher;
  classroomMembers: ClassroomMember[];
  enrolledCount: number;
  onAddStudents: () => void;
}

export function PeopleTab({
  classroomId,
  teacher,
  classroomMembers,
  enrolledCount,
  onAddStudents,
}: PeopleTabProps) {
  const removeStudentsMutation = useRemoveStudentsFromClassroom();
  const [studentToRemove, setStudentToRemove] =
    useState<ClassroomMember | null>(null);

  const handleConfirmRemove = async () => {
    if (!studentToRemove) return;

    try {
      await removeStudentsMutation.mutateAsync({
        classroomId,
        studentIds: [studentToRemove.studentId],
      });
      setStudentToRemove(null);
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleSendMessage = (name: string) => {
    toast.info(`Messaging feature coming soon!`, {
      description: `This is a demo button for sending a message to ${name}.`,
    });
  };

  return (
    <div className='max-w-3xl mx-auto space-y-6 mt-6'>
      {/* Teacher Section */}
      <Card>
        <CardHeader>
          <CardTitle>Instructor</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex items-center gap-4 p-3'>
            <Avatar>
              <AvatarFallback>{getInitials(teacher.name)}</AvatarFallback>
            </Avatar>
            <div className='flex-1 min-w-0'>
              <p className='font-medium'>{teacher.name}</p>
              <p className='text-sm text-muted-foreground truncate'>
                {teacher.email}
              </p>
            </div>
            <Button
              variant='ghost'
              size='icon'
              className='text-muted-foreground hover:text-primary hover:bg-primary/10 size-8'
              onClick={() => handleSendMessage(teacher.name)}
            >
              <IconMessage className='size-4' />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Students Section */}
      <Card>
        <CardHeader>
          <CardTitle>Students ({enrolledCount})</CardTitle>
          <CardDescription>
            Manage students enrolled in this classroom
          </CardDescription>
          <CardAction>
            <RoleGuard allowedRoles={[Role.Instructor]}>
              <Button onClick={onAddStudents} size='sm'>
                <IconUserPlus />
                Add Students
              </Button>
            </RoleGuard>
          </CardAction>
        </CardHeader>
        <CardContent>
          {enrolledCount > 0 ? (
            <div className='space-y-3'>
              {classroomMembers.map((member) => (
                <div
                  key={member.studentId}
                  className='flex items-center gap-4 p-3 rounded-lg hover:bg-accent/50 transition-colors'
                >
                  <Avatar>
                    <AvatarFallback>
                      {getInitials(member.student.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className='flex-1 min-w-0'>
                    <p className='font-medium'>{member.student.name}</p>
                    <p className='text-sm text-muted-foreground truncate'>
                      {member.student.email}
                    </p>
                  </div>
                  <div className='flex items-center gap-4'>
                    <Button
                      variant='ghost'
                      size='icon'
                      className='text-muted-foreground hover:text-primary hover:bg-primary/10 size-8'
                      onClick={() => handleSendMessage(member.student.name)}
                    >
                      <IconMessage className='size-4' />
                    </Button>
                    <RoleGuard allowedRoles={[Role.Instructor]}>
                      <Button
                        variant='ghost'
                        size='icon'
                        className='text-destructive hover:text-destructive hover:bg-destructive/10 size-8'
                        onClick={() => setStudentToRemove(member)}
                        disabled={removeStudentsMutation.isPending}
                      >
                        {removeStudentsMutation.isPending &&
                        studentToRemove?.studentId === member.studentId ? (
                          <IconLoader2 className='size-4 animate-spin' />
                        ) : (
                          <IconUserX className='size-4' />
                        )}
                      </Button>
                    </RoleGuard>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className='flex flex-col items-center justify-center py-12 px-4 border-2 border-dashed rounded-lg'>
              <IconUsers size={48} className='text-muted-foreground mb-4' />
              <h3 className='text-lg font-semibold mb-2'>No students yet</h3>
              <p className='text-sm text-muted-foreground text-center mb-4'>
                Add students to get started with your classroom
              </p>
              <RoleGuard allowedRoles={[Role.Instructor]}>
                <Button onClick={onAddStudents}>
                  <IconUserPlus className='mr-2 h-4 w-4' />
                  Add Your First Student
                </Button>
              </RoleGuard>
            </div>
          )}
        </CardContent>
      </Card>

      <DeleteConfirmDialog
        open={!!studentToRemove}
        onOpenChange={(open) => !open && setStudentToRemove(null)}
        title='Remove Student'
        description={
          <>
            Are you sure you want to remove{' '}
            <strong>{studentToRemove?.student.name}</strong> from this
            classroom? They will no longer have access to course materials.
          </>
        }
        confirmText='Remove Student'
        onConfirm={handleConfirmRemove}
        isLoading={removeStudentsMutation.isPending}
      />
    </div>
  );
}
