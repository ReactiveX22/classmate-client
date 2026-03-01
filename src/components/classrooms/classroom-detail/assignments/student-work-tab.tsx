'use client';

import { useSubmissions } from '@/hooks/use-submissions';
import { useState, useMemo } from 'react';
import { DataTable } from '@/components/data-table/data-table';
import {
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
  RowData,
} from '@tanstack/react-table';
import { getColumns } from './columns';
import { Submission } from '@/lib/api/services/submission.service';
import { PaginationParams } from '@/types/pagination';
import { useGradeSubmission } from '@/hooks/use-grade-submission';
import { useReturnSubmission } from '@/hooks/use-return-submission';
import { StudentWorkActionBar } from './student-work-action-bar';

declare module '@tanstack/react-table' {
  interface TableMeta<TData extends RowData> {
    isSavingRow?: string | null;
  }
}

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
    queryParams,
  );

  const submissions = data?.data || [];
  const meta = data?.meta;

  const handleGrade = (studentId: string, grade: number, feedback?: string) => {
    gradeMutation.mutate({
      classroomId,
      postId,
      studentId,
      grade,
      feedback,
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
        dueDate,
      ),
    [classroomId, postId, maxPoints, handleGrade, handleReturn, dueDate],
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
        ? gradeMutation.variables?.studentId
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
      <DataTable table={table} />
      <StudentWorkActionBar
        table={table}
        onBulkReturn={handleBulkReturn}
        isReturning={returnMutation.isPending}
      />
    </div>
  );
}
