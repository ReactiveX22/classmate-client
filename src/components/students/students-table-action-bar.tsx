'use client';

import type { Table } from '@tanstack/react-table';
import { Trash2, X } from 'lucide-react';
import * as React from 'react';
import {
  ActionBar,
  ActionBarClose,
  ActionBarGroup,
  ActionBarItem,
  ActionBarSelection,
  ActionBarSeparator,
} from '@/components/ui/action-bar';
import { StudentData } from '@/lib/api/services/student.service';
import { useDeleteStudent } from '@/hooks/use-students';
import { toast } from 'sonner';

interface StudentsTableActionBarProps {
  table: Table<StudentData>;
}

export function StudentsTableActionBar({ table }: StudentsTableActionBarProps) {
  const rows = table.getFilteredSelectedRowModel().rows;

  const onOpenChange = React.useCallback(
    (open: boolean) => {
      if (!open) {
        table.toggleAllRowsSelected(false);
      }
    },
    [table],
  );

  const deleteStudentMutation = useDeleteStudent();

  const onBulkDelete = React.useCallback(async () => {
    try {
      await Promise.all(
        rows.map((row) => {
          if (row.original.student?.userId) {
            return deleteStudentMutation.mutateAsync(
              row.original.student.userId,
            );
          }
          return Promise.resolve();
        }),
      );
      toast.success(`Deleted ${rows.length} student(s)`);
      table.toggleAllRowsSelected(false);
    } catch (error) {
      // Error handled by hook
    }
  }, [rows, table, deleteStudentMutation]);

  return (
    <ActionBar open={rows.length > 0} onOpenChange={onOpenChange}>
      <ActionBarSelection>
        <span className='font-medium'>{rows.length}</span>
        <span>selected</span>
        <ActionBarSeparator />
        <ActionBarClose>
          <X />
        </ActionBarClose>
      </ActionBarSelection>
      <ActionBarSeparator />
      <ActionBarGroup>
        <ActionBarItem
          variant='destructive'
          onClick={onBulkDelete}
          disabled={deleteStudentMutation.isPending}
        >
          <Trash2 />
          {deleteStudentMutation.isPending ? 'Deleting...' : 'Delete'}
        </ActionBarItem>
      </ActionBarGroup>
    </ActionBar>
  );
}
