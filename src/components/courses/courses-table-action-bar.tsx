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
import { Course } from '@/lib/api/services/course.service';
import { useDeleteCourse } from '@/hooks/use-courses';
import { toast } from 'sonner';

interface CoursesTableActionBarProps {
  table: Table<Course>;
}

export function CoursesTableActionBar({ table }: CoursesTableActionBarProps) {
  const rows = table.getFilteredSelectedRowModel().rows;

  const onOpenChange = React.useCallback(
    (open: boolean) => {
      if (!open) {
        table.toggleAllRowsSelected(false);
      }
    },
    [table],
  );

  const deleteCourseMutation = useDeleteCourse();

  const onBulkDelete = React.useCallback(async () => {
    try {
      await Promise.all(
        rows.map((row) => deleteCourseMutation.mutateAsync(row.original.id)),
      );
      toast.success(`Deleted ${rows.length} course(s)`);
      table.toggleAllRowsSelected(false);
    } catch (error) {
      // Error handled by hook
    }
  }, [rows, table, deleteCourseMutation]);

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
          disabled={deleteCourseMutation.isPending}
        >
          <Trash2 />
          {deleteCourseMutation.isPending ? 'Deleting...' : 'Delete'}
        </ActionBarItem>
      </ActionBarGroup>
    </ActionBar>
  );
}
