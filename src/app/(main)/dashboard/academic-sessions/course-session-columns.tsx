'use client';

import { ColumnDef } from '@tanstack/react-table';
import { CourseSession } from '@/lib/api/services/course-session.service';
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { useDeleteCourseSession } from '@/hooks/use-course-sessions';
import { format } from 'date-fns';

import { EditCourseSessionDialog } from '@/components/academic-sessions/edit-course-session-dialog';
import { DeleteConfirmDialog } from '@/components/common/delete-confirm-dialog';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';

import { Checkbox } from '@/components/ui/checkbox';

export const courseSessionColumns: ColumnDef<CourseSession>[] = [
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
    accessorKey: 'isCurrent',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label='Status' />
    ),
    meta: {
      label: 'Status',
    },
    cell: ({ row }) => {
      const isCurrent = row.getValue('isCurrent') as boolean;
      return isCurrent ? (
        <Badge
          variant='secondary'
          className={cn(
            'bg-emerald-500/15 text-emerald-600 hover:bg-emerald-500/20 border-emerald-500/20 dark:text-emerald-400'
          )}
        >
          Current
        </Badge>
      ) : (
        <span className='text-muted-foreground'>-</span>
      );
    },
    enableSorting: true,
  },
  {
    id: 'actions',
    cell: function ActionsCell({ row }) {
      const session = row.original;
      const [showEditDialog, setShowEditDialog] = useState(false);
      const [showDeleteDialog, setShowDeleteDialog] = useState(false);
      const { mutate: deleteSession, isPending: isDeleting } = useDeleteCourseSession();

      return (
        <div className='flex justify-end'>
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
            />
            <DropdownMenuContent align='end' className='w-40'>
              <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
                <Edit className='h-4 w-4 mr-2' /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                variant='destructive'
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash2 className='h-4 w-4 mr-2' /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <EditCourseSessionDialog
            session={session}
            open={showEditDialog}
            onOpenChange={setShowEditDialog}
          />

          <DeleteConfirmDialog
            open={showDeleteDialog}
            onOpenChange={setShowDeleteDialog}
            title='Delete Course Session'
            description={`Are you sure you want to delete "${session.name}"? This action cannot be undone.`}
            onConfirm={() => {
              deleteSession(session.id, {
                onSuccess: () => setShowDeleteDialog(false),
              });
            }}
            isLoading={isDeleting}
          />
        </div>
      );
    },
    size: 40,
  },
];
