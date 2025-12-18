'use client';

import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { TeacherData } from '@/lib/api/services/teacher.service';
import type { ColumnDef } from '@tanstack/react-table';
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
      const title = row.original.teacher.title;

      return (
        <div className='flex flex-col'>
          <span className='font-medium'>{name}</span>
          <span className='text-xs text-muted-foreground'>{title}</span>
        </div>
      );
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
    accessorKey: 'user.createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label='Joined' />
    ),
    meta: {
      label: 'Joined',
      variant: 'date',
    },
    cell: ({ row }) => {
      return new Date(
        row.original.teacher?.joinDate || row.original.user.createdAt
      ).toLocaleDateString();
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
            <DropdownMenuGroup>
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(student.user.id)}
              >
                Copy User ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>View details</DropdownMenuItem>
              <DropdownMenuItem>Edit student</DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    size: 40,
  },
];
