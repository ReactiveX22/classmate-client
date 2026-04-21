'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Semester } from '@/lib/api/services/semester.service';
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { useDeleteSemester } from '@/hooks/use-semesters';

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
      const { mutate: deleteSemester } = useDeleteSemester();

      return (
        <div className='flex justify-end gap-2'>
          <Button variant='ghost' size='icon' onClick={() => {
            // TODO: Edit implementation
          }}>
            <Edit className='h-4 w-4' />
          </Button>
          <Button variant='ghost' size='icon' onClick={() => {
             if (window.confirm('Are you sure you want to delete this semester?')) {
               deleteSemester(semester.id);
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
