'use client';

import { ColumnDef } from '@tanstack/react-table';
import { CourseSession } from '@/lib/api/services/course-session.service';
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { useDeleteCourseSession } from '@/hooks/use-course-sessions';
import { format } from 'date-fns';

export const courseSessionColumns: ColumnDef<CourseSession>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label='Name' />
    ),
    meta: {
      label: 'Name',
    },
    cell: ({ row }) => <div className='font-medium'>{row.getValue('name')}</div>,
    enableSorting: true,
  },
  {
    accessorKey: 'startDate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label='Start Date' />
    ),
    meta: {
      label: 'Start Date',
    },
    cell: ({ row }) => {
      const date = row.getValue('startDate') as string;
      return <div>{date ? format(new Date(date), 'MMM d, yyyy') : '-'}</div>;
    },
  },
  {
    accessorKey: 'endDate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label='End Date' />
    ),
    meta: {
      label: 'End Date',
    },
    cell: ({ row }) => {
      const date = row.getValue('endDate') as string;
      return <div>{date ? format(new Date(date), 'MMM d, yyyy') : '-'}</div>;
    },
  },
  {
    id: 'actions',
    cell: function ActionsCell({ row }) {
      const session = row.original;
      const { mutate: deleteSession } = useDeleteCourseSession();

      return (
        <div className='flex justify-end gap-2'>
          <Button variant='ghost' size='icon' onClick={() => {
            // TODO: Edit implementation
          }}>
            <Edit className='h-4 w-4' />
          </Button>
          <Button variant='ghost' size='icon' onClick={() => {
             if (window.confirm('Are you sure you want to delete this session?')) {
               deleteSession(session.id);
             }
          }}>
            <Trash2 className='h-4 w-4 text-red-500' />
          </Button>
        </div>
      );
    },
    size: 40,
  },
];
