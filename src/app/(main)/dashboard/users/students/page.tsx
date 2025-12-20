'use client';

import { DataTable } from '@/components/data-table/data-table';
import { DataTableToolbar } from '@/components/data-table/data-table-toolbar';
import { useDataTable } from '@/hooks/use-data-table';
import { useStudents } from '@/hooks/use-students';
import { getSortingStateParser } from '@/lib/parsers';
import { parseAsInteger, useQueryState } from 'nuqs';
import { AddStudentDialog } from '@/components/students/add-student-dialog';
import { columns } from './columns';

export default function StudentsPage() {
  const [page] = useQueryState('page', parseAsInteger.withDefault(1));
  const [perPage] = useQueryState('perPage', parseAsInteger.withDefault(10));
  const [sorting] = useQueryState(
    'sort',
    getSortingStateParser().withDefault([])
  );

  const {
    data: response,
    isLoading,
    isError,
  } = useStudents({
    page,
    limit: perPage,
    sortBy: sorting[0]?.id,
    sortOrder: sorting[0]?.desc ? 'desc' : 'asc',
  });

  const students = response?.data || [];
  const pageCount = response?.meta?.totalPages || 1;

  const { table } = useDataTable({
    data: students,
    columns,
    pageCount,
  });

  return (
    <div className='flex flex-col gap-6 p-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Students</h1>
          <p className='text-muted-foreground'>
            Manage all students in your organization.
          </p>
        </div>
        <AddStudentDialog />
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : isError ? (
        <div className='text-red-500'>Error loading students.</div>
      ) : (
        <DataTable table={table}>
          <DataTableToolbar table={table} />
        </DataTable>
      )}
    </div>
  );
}
