'use client';

import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Course } from '@/lib/api/services/course.service';
import { IconEdit, IconTrash, IconEye } from '@tabler/icons-react';
import type { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { MoreHorizontal } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { EditCourseDialog } from '@/components/courses/edit-course-dialog';
import { DeleteCourseDialog } from '@/components/courses/delete-course-dialog';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export const columns: ColumnDef<Course>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
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
    accessorKey: 'title',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label='Title' />
    ),
    meta: {
      label: 'Title',
      placeholder: 'Filter by title...',
      variant: 'text',
    },
    cell: ({ row }) => {
      return (
        <Link
          href={`/dashboard/courses/${row.original.id}`}
          className='font-medium hover:underline underline-offset-4 decoration-primary/30 text-primary'
        >
          {row.original.title}
        </Link>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: 'code',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label='Code' />
    ),
    meta: {
      label: 'Code',
      placeholder: 'Filter by code...',
      variant: 'text',
    },
    cell: ({ row }) => {
      return <Badge variant='secondary'>{row.original.code}</Badge>;
    },
    enableSorting: true,
  },
  {
    accessorKey: 'semester',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label='Semester' />
    ),
    meta: {
      label: 'Semester',
      placeholder: 'Filter by semester...',
      variant: 'text',
    },
    cell: ({ row }) => {
      return <div>{row.original.semester}</div>;
    },
    enableSorting: true,
  },
  {
    accessorKey: 'credits',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label='Credits' />
    ),
    meta: {
      label: 'Credits',
      variant: 'text',
    },
    cell: ({ row }) => {
      return <div>{row.original.credits}</div>;
    },
    enableSorting: true,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label='Status' />
    ),
    meta: {
      label: 'Status',
      variant: 'select',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Pending', value: 'pending' },
        { label: 'Suspended', value: 'suspended' },
      ],
    },
    cell: ({ row }) => {
      const status = row.original.status;
      const isActive = status === 'active';
      const isPending = status === 'pending';

      return (
        <Badge
          variant={isActive ? 'outline' : isPending ? 'default' : 'destructive'}
          className={cn(
            'capitalize',
            isPending &&
              'text-amber-600 dark:text-amber-200 bg-amber-400/10 hover:shadow-amber-500/30'
          )}
        >
          {status}
        </Badge>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label='Created' />
    ),
    meta: {
      label: 'Created',
      variant: 'date',
    },
    cell: ({ row }) => {
      const date = new Date(row.original.createdAt);
      return <span>{format(date, 'MMM dd, yyyy')}</span>;
    },
    enableSorting: true,
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const course = row.original;
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
            <DropdownMenuContent align='end' className='w-44'>
              <DropdownMenuItem
                render={<Link href={`/dashboard/courses/${course.id}`} />}
              >
                <IconEye /> View Details
              </DropdownMenuItem>
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

          <EditCourseDialog
            course={course}
            open={showEditDialog}
            onOpenChange={setShowEditDialog}
          />

          <DeleteCourseDialog
            course={course}
            open={showDeleteDialog}
            onOpenChange={setShowDeleteDialog}
          />
        </>
      );
    },
    size: 40,
  },
];
