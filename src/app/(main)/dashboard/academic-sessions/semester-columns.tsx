'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Semester } from '@/lib/api/services/semester.service';
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { useDeleteSemester } from '@/hooks/use-semesters';

import { EditSemesterDialog } from '@/components/academic-sessions/edit-semester-dialog';
import { DeleteConfirmDialog } from '@/components/common/delete-confirm-dialog';
import { useState } from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';

export const semesterColumns: ColumnDef<Semester>[] = [
  {
    accessorKey: 'ordinal',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label='Ordinal' />
    ),
    meta: {
      label: 'Ordinal',
    },
    cell: ({ row }) => <div className='font-medium'>{row.getValue('ordinal')}</div>,
    enableSorting: true,
  },

  {
    id: 'actions',
    cell: function ActionsCell({ row }) {
      const semester = row.original;
      const [showEditDialog, setShowEditDialog] = useState(false);
      const [showDeleteDialog, setShowDeleteDialog] = useState(false);
      const { mutate: deleteSemester, isPending: isDeleting } = useDeleteSemester();

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

          <EditSemesterDialog
            semester={semester}
            open={showEditDialog}
            onOpenChange={setShowEditDialog}
          />

          <DeleteConfirmDialog
            open={showDeleteDialog}
            onOpenChange={setShowDeleteDialog}
            title='Delete Semester'
            description={`Are you sure you want to delete semester ${semester.ordinal}? This action cannot be undone.`}
            onConfirm={() => {
              deleteSemester(semester.id, {
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
