'use client';

import {
  ActionBar,
  ActionBarClose,
  ActionBarGroup,
  ActionBarItem,
  ActionBarSelection,
  ActionBarSeparator,
} from '@/components/ui/action-bar';
import { Submission } from '@/lib/api/services/submission.service';
import { IconArrowBackUp } from '@tabler/icons-react';
import type { Table } from '@tanstack/react-table';
import { X } from 'lucide-react';
import * as React from 'react';

interface StudentWorkActionBarProps {
  table: Table<Submission>;
  onBulkReturn: () => void;
  isReturning?: boolean;
}

export function StudentWorkActionBar({
  table,
  onBulkReturn,
  isReturning,
}: StudentWorkActionBarProps) {
  const rows = table.getFilteredSelectedRowModel().rows;

  // Filter to only count returnable rows (not already returned or assigned)
  const returnableRows = rows.filter(
    (row) =>
      row.original.status !== 'returned' && row.original.status !== 'assigned'
  );

  const onOpenChange = React.useCallback(
    (open: boolean) => {
      if (!open) {
        table.toggleAllRowsSelected(false);
      }
    },
    [table]
  );

  const handleReturn = React.useCallback(() => {
    onBulkReturn();
  }, [onBulkReturn]);

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
          onClick={handleReturn}
          disabled={isReturning || returnableRows.length === 0}
        >
          <IconArrowBackUp />
          Return {returnableRows.length > 0 && `(${returnableRows.length})`}
        </ActionBarItem>
      </ActionBarGroup>
    </ActionBar>
  );
}
