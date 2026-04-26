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
import { useDeleteTeacher } from '@/hooks/use-teachers';
import { TeacherData } from '@/lib/api/services/teacher.service';
import { toast } from 'sonner';

interface TeachersTableActionBarProps {
  table: Table<TeacherData>;
}

export function TeachersTableActionBar({ table }: TeachersTableActionBarProps) {
  const rows = table.getFilteredSelectedRowModel().rows;

  const onOpenChange = React.useCallback(
    (open: boolean) => {
      if (!open) {
        table.toggleAllRowsSelected(false);
      }
    },
    [table],
  );

  const deleteTeacherMutation = useDeleteTeacher();

  const onBulkDelete = React.useCallback(async () => {
    try {
      await Promise.all(
        rows.map((row) =>
          deleteTeacherMutation.mutateAsync(row.original.teacher.userId),
        ),
      );
      toast.success(`Deleted ${rows.length} teacher(s)`);
      table.toggleAllRowsSelected(false);
    } catch {
      // Error handled by hook
    }
  }, [rows, table, deleteTeacherMutation]);

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
          disabled={deleteTeacherMutation.isPending}
        >
          <Trash2 />
          {deleteTeacherMutation.isPending ? 'Deleting...' : 'Delete'}
        </ActionBarItem>
      </ActionBarGroup>
    </ActionBar>
  );
}
