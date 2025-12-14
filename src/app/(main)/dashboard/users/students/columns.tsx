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
import type { StudentData } from '@/lib/api/services/student.service';
import type { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';

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
        className='translate-y-[2px]'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
        className='translate-y-[2px]'
      />
    ),
    enableSorting: false,
    enableHiding: false,
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
      const studentId = row.original.student?.id;
      return (
        <div className='flex flex-col'>
          <span className='font-medium'>{name}</span>
          <span className='text-xs text-muted-foreground'>{studentId}</span>
        </div>
      );
    },
    enableSorting: true, // Explicitly enable sorting
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
    enableSorting: true,
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
      return new Date(row.original.user.createdAt).toLocaleDateString();
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
          <DropdownMenuContent align='end' className='w-[160px]'>
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
  },
];
