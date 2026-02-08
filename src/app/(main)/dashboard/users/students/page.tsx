'use client';

import { DataTable } from '@/components/data-table/data-table';
import { DataTableToolbar } from '@/components/data-table/data-table-toolbar';
import { useDataTable } from '@/hooks/use-data-table';
import { useStudents } from '@/hooks/use-students';
import { useTableQueryState } from '@/hooks/use-table-query';
import { AddStudentDialog } from '@/components/students/add-student-dialog';
import { StudentsTableActionBar } from '@/components/students/students-table-action-bar';
import { columns } from './columns';
import { StudentData } from '@/lib/api/services/student.service';
import { ExtendedColumnSort } from '@/types/data-table';
import { PageHeader } from '@/components/common/page-header';

const DEFAULT_SORTING: ExtendedColumnSort<StudentData>[] = [
  { id: 'user.createdAt', desc: true },
];

export default function StudentsPage() {
  const { page, perPage, sorting } =
    useTableQueryState<StudentData>(DEFAULT_SORTING);

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
    initialState: {
      sorting: DEFAULT_SORTING,
    },
    clearOnDefault: true,
  });

  return (
    <div className='flex flex-col gap-6 p-6'>
      <PageHeader
        title='Students'
        description='Manage all students in your organization.'
      >
        <AddStudentDialog />
      </PageHeader>

      {isLoading ? (
        <div>Loading...</div>
      ) : isError ? (
        <div className='text-red-500'>Error loading students.</div>
      ) : (
        <DataTable
          table={table}
          className='w-fit'
          actionBar={<StudentsTableActionBar table={table} />}
        >
          <DataTableToolbar table={table} />
        </DataTable>
      )}
    </div>
  );
}
