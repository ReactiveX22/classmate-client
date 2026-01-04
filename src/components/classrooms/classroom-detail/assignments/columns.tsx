'use client';

import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Submission } from '@/lib/api/services/submission.service';
import {
  IconArrowBackUp,
  IconCheck,
  IconDotsVertical,
  IconFile,
} from '@tabler/icons-react';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { EyeIcon } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { EditableGradeCell } from './editable-grade-cell';

export const getColumns = (
  classroomId: string,
  postId: string,
  maxPoints: number = 100,
  onGrade: (submissionId: string, grade: number) => void,
  onReturn: (submissionId: string) => void,
  dueDate?: string | null
): ColumnDef<Submission>[] => [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          (table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')) as any
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
        className='translate-y-[2px]'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
        className='translate-y-[2px]'
        disabled={
          row.original.status === 'returned' ||
          row.original.status === 'assigned'
        }
      />
    ),
    enableSorting: false,
    enableHiding: false,
    size: 30,
  },
  {
    accessorFn: (row) => row.student?.name,
    id: 'student',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label='Student' />
    ),
    cell: ({ row }) => {
      const student = row.original.student;
      return (
        <div className='flex items-center gap-3 font-medium'>
          <Avatar className='h-8 w-8'>
            <AvatarImage src={student?.image || undefined} />
            <AvatarFallback className='text-xs'>
              {student?.name?.substring(0, 2).toUpperCase() || '??'}
            </AvatarFallback>
          </Avatar>
          <div className='flex flex-col'>
            <span className='text-sm'>{student?.name}</span>
            <span className='text-xs text-muted-foreground'>
              {student?.email}
            </span>
          </div>
        </div>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label='Status' />
    ),
    cell: ({ row }) => {
      const status = row.original.status;
      switch (status) {
        case 'assigned':
          return (
            <Badge
              variant='outline'
              className='text-muted-foreground font-normal bg-transparent border-dashed'
            >
              Assigned
            </Badge>
          );
        case 'turned_in':
          return (
            <Badge
              variant='secondary'
              className='bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400 gap-1'
            >
              <IconCheck size={14} />
              Turned in
            </Badge>
          );
        case 'graded':
          return (
            <Badge
              variant='secondary'
              className='bg-purple-100 text-purple-700 hover:bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400 gap-1'
            >
              <IconCheck size={14} />
              Graded
            </Badge>
          );
        case 'returned':
          return (
            <Badge
              variant='secondary'
              className='bg-gray-100 text-gray-700 hover:bg-gray-100 dark:bg-gray-900/30 dark:text-gray-400 gap-1'
            >
              Returned
            </Badge>
          );
        default:
          return <Badge variant='outline'>{status}</Badge>;
      }
    },
    enableSorting: true,
  },
  {
    accessorKey: 'submittedAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label='Turned In' />
    ),
    cell: ({ row }) => {
      const date = row.original.submittedAt;
      const status = row.original.status;

      if (
        status === 'turned_in' ||
        status === 'graded' ||
        (date && status !== 'assigned')
      ) {
        const isLate = dueDate && new Date(date) > new Date(dueDate);

        return (
          <div className='flex items-center gap-2'>
            <span className='text-sm text-muted-foreground'>
              {format(new Date(date), 'MMM d, p')}
            </span>
            {isLate && <Badge variant='destructive'>Late</Badge>}
          </div>
        );
      }
      return <span className='text-sm text-muted-foreground'>-</span>;
    },
    enableSorting: true,
  },
  {
    accessorKey: 'grade',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label='Grade' />
    ),
    cell: ({ row, table }) => {
      const isSaving =
        (table.options.meta as any)?.isSavingRow === row.original.id;
      return (
        <EditableGradeCell
          initialGrade={row.original.grade}
          maxPoints={maxPoints}
          isSaving={isSaving}
          onSave={(newGrade) => {
            onGrade(row.original.id, newGrade);
          }}
        />
      );
    },
    enableSorting: true,
    size: 30,
  },
  {
    id: 'attachments',
    header: 'Attachments',
    cell: ({ row }) => {
      const attachments = row.original.attachments;
      if (!attachments || attachments.length === 0) {
        return <span className='text-muted-foreground text-xs'>-</span>;
      }

      return (
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant='ghost'
                size='sm'
                className='gap-2 w-full text-muted-foreground justify-start'
              >
                <IconFile size={16} />
                {attachments.length} files
              </Button>
            }
          />
          <DropdownMenuContent align='end' className='w-[200px]'>
            {attachments.map((file) => (
              <DropdownMenuItem
                key={file.id}
                onClick={() => window.open(file.url, '_blank')}
                className='cursor-pointer'
              >
                <EyeIcon size={14} />
                <span className='truncate max-w-[200px]'>{file.name}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    size: 30,
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant='ghost' size='icon' className='h-8 w-8'>
                <IconDotsVertical size={16} />
              </Button>
            }
          />
          <DropdownMenuContent align='end'>
            <DropdownMenuItem
              disabled={status === 'returned' || status === 'assigned'}
              onClick={() => onReturn(row.original.id)}
            >
              <IconArrowBackUp size={16} />
              Return
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    size: 40,
  },
];
