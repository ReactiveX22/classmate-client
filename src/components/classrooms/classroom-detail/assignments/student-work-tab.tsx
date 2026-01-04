'use client';

import { useSubmissions } from '@/hooks/use-submissions';
import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/data-table/data-table';
import {
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
} from '@tanstack/react-table';
import { getColumns } from './columns';
import { Submission } from '@/lib/api/services/submission.service';
import { RowData } from '@tanstack/react-table';

declare module '@tanstack/react-table' {
  interface TableMeta<TData extends RowData> {
    isSavingRow?: string | null;
  }
}

import { PaginationParams } from '@/types/pagination';

import { useGradeSubmission } from '@/hooks/use-grade-submission';
import { useReturnSubmission } from '@/hooks/use-return-submission';
import {
  IconChevronLeft,
  IconChevronRight,
  IconDotsVertical,
  IconArrowBackUp,
} from '@tabler/icons-react';

interface StudentWorkTabProps {
  classroomId: string;
  postId: string;
  maxPoints?: number;
  dueDate?: string | null;
}

export function StudentWorkTab({
  classroomId,
  postId,
  maxPoints = 100,
  dueDate,
}: StudentWorkTabProps) {
  const [page, setPage] = useState(1);
  const limit = 10;
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState({});

  const gradeMutation = useGradeSubmission();
  const returnMutation = useReturnSubmission();

  const queryParams: PaginationParams = {
    page,
    limit,
    sortBy: sorting.length > 0 ? sorting[0].id : undefined,
    sortOrder:
      sorting.length > 0 ? (sorting[0].desc ? 'desc' : 'asc') : undefined,
  };

  const { data, isLoading, isPlaceholderData } = useSubmissions(
    classroomId,
    postId,
    queryParams
  );

  const submissions = data?.data || [];
  const meta = data?.meta;

  const handleGrade = (submissionId: string, grade: number) => {
    gradeMutation.mutate({
      classroomId,
      postId,
      submissionId,
      grade,
    });
  };

  const handleReturn = (submissionId: string) => {
    returnMutation.mutate({
      classroomId,
      postId,
      submissionId,
    });
  };

  const handleBulkReturn = () => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    selectedRows.forEach((row) => {
      if (
        row.original.status !== 'returned' &&
        row.original.status !== 'assigned'
      ) {
        handleReturn(row.original.id);
      }
    });
    setRowSelection({});
  };

  const columns = useMemo(
    () =>
      getColumns(
        classroomId,
        postId,
        maxPoints,
        handleGrade,
        handleReturn,
        dueDate
      ),
    [classroomId, postId, maxPoints, handleGrade, handleReturn, dueDate]
  );

  const table = useReactTable({
    data: submissions,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      rowSelection,
      pagination: {
        pageIndex: page - 1,
        pageSize: limit,
      },
    },
    manualPagination: true,
    pageCount: meta?.totalPages || -1,
    meta: {
      isSavingRow: gradeMutation.isPending
        ? gradeMutation.variables?.submissionId
        : null,
    },
    onPaginationChange: (updater) => {
      if (typeof updater === 'function') {
        const newState = updater({
          pageIndex: page - 1,
          pageSize: limit,
        });
        setPage(newState.pageIndex + 1);
      }
    },
  });

  if (isLoading) {
    return (
      <div className='flex items-center justify-center p-12'>
        <span className='text-muted-foreground'>Loading submissions...</span>
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      <DataTable
        table={table}
        actionBar={
          <div className='flex items-center gap-4 px-4 py-2 border rounded-lg bg-primary/5 border-primary/20 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-2 duration-300'>
            <span className='text-sm font-medium text-primary'>
              {table.getFilteredSelectedRowModel().rows.length} selected
            </span>
            <div className='h-4 w-px bg-primary/20' />
            <Button
              size='sm'
              variant='default'
              className='gap-2 h-8'
              onClick={handleBulkReturn}
              disabled={returnMutation.isPending}
            >
              <IconArrowBackUp size={16} />
              Return
            </Button>
          </div>
        }
      />
    </div>
  );
}
