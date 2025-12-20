'use client';

import type { Table } from '@tanstack/react-table';
import { CheckCircle2, Trash2, X } from 'lucide-react';
import * as React from 'react';
import {
  ActionBar,
  ActionBarClose,
  ActionBarGroup,
  ActionBarItem,
  ActionBarSelection,
  ActionBarSeparator,
} from '@/components/ui/action-bar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
    [table]
  );

  const onStatusUpdate = React.useCallback(
    (status: 'active' | 'pending' | 'suspended') => {
      // TODO: Implement bulk status update API call
      toast.success(
        `Status updated to ${status} for ${rows.length} teacher(s)`
      );
      table.toggleAllRowsSelected(false);
    },
    [rows, table]
  );

  const onTeacherDelete = React.useCallback(() => {
    // TODO: Implement bulk delete API call
    toast.success(`Deleted ${rows.length} teacher(s)`);
    table.toggleAllRowsSelected(false);
  }, [rows, table]);

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
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <ActionBarItem
                onSelect={(e) => {
                  e.preventDefault();
                }}
              >
                <CheckCircle2 />
                Status
              </ActionBarItem>
            }
          ></DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              className='capitalize'
              onClick={() => onStatusUpdate('active')}
            >
              Active
            </DropdownMenuItem>
            <DropdownMenuItem
              className='capitalize'
              onClick={() => onStatusUpdate('pending')}
            >
              Pending
            </DropdownMenuItem>
            <DropdownMenuItem
              className='capitalize'
              onClick={() => onStatusUpdate('suspended')}
            >
              Suspended
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <ActionBarItem variant='destructive' onClick={onTeacherDelete}>
          <Trash2 />
          Delete
        </ActionBarItem>
      </ActionBarGroup>
    </ActionBar>
  );
}
