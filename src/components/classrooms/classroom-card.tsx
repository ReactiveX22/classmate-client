import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { ClassroomWithCourse } from '@/lib/api/services/classroom.service';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials } from '@/lib/utils';
import { IconBook, IconCalendar, IconChevronRight } from '@tabler/icons-react';
import { Code } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '../ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { IconDotsVertical } from '@tabler/icons-react';
import { RoleGuard } from '@/components/common/role-guard';
import { Role } from '@/types/auth';
import { useDeleteClassroom } from '@/hooks/use-classrooms';
import { DeleteConfirmDialog } from '@/components/common/delete-confirm-dialog';
import { useState } from 'react';
import { Trash } from 'lucide-react';

interface ClassroomCardProps {
  data: ClassroomWithCourse;
}

export function ClassroomCard({ data }: ClassroomCardProps) {
  const { classroom, course, teacher, upcoming } = data;
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const deleteClassroomMutation = useDeleteClassroom();

  const handleDelete = () => {
    deleteClassroomMutation.mutate(classroom.id, {
      onSuccess: () => {
        setDeleteDialogOpen(false);
      },
    });
  };

  return (
    <Card className='h-full'>
      <CardHeader className='flex flex-row items-start justify-between space-y-0 gap-2'>
        <div className='space-y-1.5 flex-1 min-w-0'>
          <h3 className='text-lg font-semibold truncate tracking-tight group-hover:text-primary transition-colors'>
            {classroom.name}
          </h3>
          <div className='flex  items-center gap-2 overflow-hidden'>
            <Badge variant='outline' className='text-[11px]'>
              {course.code}
            </Badge>
            <Badge variant='outline' className='text-[11px]'>
              Section {classroom.section}
            </Badge>
          </div>
        </div>

        <RoleGuard allowedRoles={[Role.Instructor]}>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant='ghost'
                  size='icon'
                  className='h-8 w-8 text-muted-foreground'
                >
                  <IconDotsVertical size={18} />
                </Button>
              }
            />
            <DropdownMenuContent align='end'>
              <DropdownMenuItem
                variant='destructive'
                onClick={() => setDeleteDialogOpen(true)}
              >
                <Trash size={16} className='mr-2' />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </RoleGuard>
      </CardHeader>
      <CardContent className='h-full'>
        <p className='text-[13px] text-muted-foreground line-clamp-2 leading-relaxed min-h-10'>
          {classroom.description || 'No description available'}
        </p>

        <div className='flex items-center gap-2 mt-3 text-[12px] text-muted-foreground'>
          <Avatar className='size-6'>
            <AvatarImage src={teacher.image || undefined} />
            <AvatarFallback className='text-[10px] bg-primary/10 text-primary'>
              {getInitials(teacher.name)}
            </AvatarFallback>
          </Avatar>
          <span className='truncate'>{teacher.name}</span>
        </div>

        <div className='mt-auto pt-4 flex items-center justify-between'>
          <div className='flex items-center gap-4 text-[11px] font-medium text-muted-foreground'>
            <div className='flex items-center gap-1.5'>
              <IconBook className='size-3 opacity-40' />
              <span>{course.credits} Credits</span>
            </div>
            <div className='flex items-center gap-1.5'>
              <Code className='size-3 opacity-40' />
              <span>{classroom.classCode}</span>
            </div>
          </div>
        </div>

        <div className='mt-4 pt-4 border-t border-dashed'>
          {upcoming && upcoming.length > 0 ? (
            <Link
              href={`/dashboard/classrooms/${classroom.id}/assignments/${upcoming[0].id}`}
              className='group/work block'
            >
              <div className='flex items-center gap-2 text-[12px] font-medium text-foreground/80 group-hover/work:text-primary transition-colors'>
                <IconCalendar className='size-3.5' />
                <span className='truncate'>{upcoming[0].title}</span>
              </div>
              <p className='text-[11px] text-muted-foreground pl-5.5 mt-0.5 truncate'>
                Due {format(new Date(upcoming[0].dueAt), 'MMM d, h:mm a')}
              </p>
            </Link>
          ) : (
            <div className='flex items-center gap-2 text-[11px] text-muted-foreground'>
              <IconCalendar className='size-3 opacity-40' />
              <span>No upcoming work</span>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter>
        <Button
          render={<Link href={`/dashboard/classrooms/${classroom.id}`} />}
          size='sm'
          className='w-full'
          variant='outline'
          nativeButton={false}
        >
          Open Classroom
          <IconChevronRight
            size={16}
            className='ml-1 group-hover:translate-x-0.5 transition-transform'
          />
        </Button>
      </CardFooter>

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title='Delete Classroom'
        description='Are you sure you want to delete this classroom? This action cannot be undone.'
        onConfirm={handleDelete}
        isLoading={deleteClassroomMutation.isPending}
      />
    </Card>
  );
}
