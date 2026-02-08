'use client';

import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { StudentData } from '@/lib/api/services/student.service';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import type { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { MoreHorizontal } from 'lucide-react';
import { useState } from 'react';
import { EditStudentDialog } from '@/components/students/edit-student-dialog';
import { DeleteStudentDialog } from '@/components/students/delete-student-dialog';

export const columns: ColumnDef<StudentData>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        indeterminate={
          table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected()
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
        className='translate-y-0.5'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
        className='translate-y-0.5'
      />
    ),
    enableSorting: false,
    enableHiding: false,
    size: 40,
  },
  {
    accessorKey: 'user.name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label='Name' />
    ),
    meta: {
      label: 'Name',
      placeholder: 'Filter by name...',
      variant: 'text',
    },
    cell: ({ row }) => {
      const name = row.original.user.name;
      return <div className='font-medium'>{name}</div>;
    },
    enableSorting: true,
  },
  {
    accessorKey: 'student.studentId',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label='Student ID' />
    ),
    meta: {
      label: 'Student ID',
      placeholder: 'Filter by ID...',
      variant: 'text',
    },
    cell: ({ row }) => {
      const studentId = row.original.student?.studentId;
      return <div className='truncate'>{studentId || '-'}</div>;
    },
  },
  {
    accessorKey: 'user.email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label='Email' />
    ),
    meta: {
      label: 'Email',
      placeholder: 'Filter by email...',
      variant: 'text',
    },
    cell: ({ row }) => {
      const email = row.original.user.email;
      return <div className='truncate'>{email}</div>;
    },
    enableSorting: true,
  },

  {
    accessorKey: 'user.createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label='Joined' />
    ),
    meta: {
      label: 'Joined',
      variant: 'date',
    },
    cell: ({ row }) => {
      const date = new Date(row.original.user.createdAt);
      return (
        <span className='font-medium'>{format(date, 'MMM dd, yyyy')}</span>
      );
    },
    enableSorting: true,
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const student = row.original;
      const [showEditDialog, setShowEditDialog] = useState(false);
      const [showDeleteDialog, setShowDeleteDialog] = useState(false);

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant='ghost'
                  className='flex h-8 w-8 p-0 data-[state=open]:bg-muted'
                >
                  <MoreHorizontal className='h-4 w-4' />
                  <span className='sr-only'>Open menu</span>
                </Button>
              }
            ></DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-40'>
              <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
                <IconEdit /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                variant='destructive'
                onClick={() => setShowDeleteDialog(true)}
              >
                <IconTrash />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <EditStudentDialog
            student={student}
            open={showEditDialog}
            onOpenChange={setShowEditDialog}
          />

          <DeleteStudentDialog
            student={student}
            open={showDeleteDialog}
            onOpenChange={setShowDeleteDialog}
          />
        </>
      );
    },
    size: 40,
  },
];
