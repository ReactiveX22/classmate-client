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
import { TeacherData } from '@/lib/api/services/teacher.service';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import type { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { MoreHorizontal } from 'lucide-react';

export const teacherColumns: ColumnDef<TeacherData>[] = [
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
  },
  {
    accessorKey: 'teacher.title',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label='Title' />
    ),
    meta: {
      label: 'Title',
      placeholder: 'Filter by title...',
      variant: 'text',
    },
    cell: ({ row }) => {
      const title = row.original.teacher.title;

      return <div>{title}</div>;
    },
  },
  {
    accessorKey: 'user.status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label='Status' />
    ),
    meta: {
      label: 'Status',
      variant: 'select',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
        { label: 'Suspended', value: 'suspended' },
      ],
    },
    cell: ({ row }) => {
      const status = row.original.user.status;
      const isActive = status === 'active';
      return (
        <Badge variant={isActive ? 'outline' : 'destructive'}>{status}</Badge>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label='Joined' />
    ),
    meta: {
      label: 'Joined',
      variant: 'date',
    },
    cell: ({ row }) => {
      const dateValue =
        row.original.teacher?.joinDate || row.original.user.createdAt;

      if (!dateValue) return <span className='text-muted-foreground'>-</span>;

      const date = new Date(dateValue);

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

      return (
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
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(student.user.id)}
            >
              <IconEdit /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem variant='destructive'>
              <IconTrash />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    size: 40,
  },
];
