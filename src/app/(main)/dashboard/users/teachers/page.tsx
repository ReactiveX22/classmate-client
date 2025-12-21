'use client';

import { DataTable } from '@/components/data-table/data-table';
import { DataTableToolbar } from '@/components/data-table/data-table-toolbar';
import { AddTeacherDialog } from '@/components/teachers/add-teacher-dialog';
import { TeachersTableActionBar } from '@/components/teachers/teachers-table-action-bar';
import { useDataTable } from '@/hooks/use-data-table';
import { useTableQueryState } from '@/hooks/use-table-query';
import { useTeachers } from '@/hooks/use-teachers';
import { TeacherData } from '@/lib/api/services/teacher.service';
import { ExtendedColumnSort } from '@/types/data-table';
import { teacherColumns } from './columns';
import { PageHeader } from '@/components/common/page-header';

const DEFAULT_SORTING: ExtendedColumnSort<TeacherData>[] = [
  { id: 'createdAt', desc: true },
];

export default function TeachersPage() {
  const { page, perPage, sorting } =
    useTableQueryState<TeacherData>(DEFAULT_SORTING);

  const {
    data: response,
    isLoading,
    isError,
  } = useTeachers({
    page,
    limit: perPage,
    sortBy: sorting[0]?.id,
    sortOrder: sorting[0]?.desc ? 'desc' : 'asc',
  });
  const students = response?.data || [];
  const pageCount = response?.meta?.totalPages || 1;

  const { table } = useDataTable({
    data: students,
    columns: teacherColumns,
    pageCount,
    initialState: {
      sorting: DEFAULT_SORTING,
    },
    clearOnDefault: true,
  });

  return (
    <div className='flex flex-col gap-6 p-6'>
      <PageHeader
        title='Teachers'
        description="Manage your school's instructors."
      >
        <AddTeacherDialog />
      </PageHeader>

      {isLoading ? (
        <div>Loading...</div>
      ) : isError ? (
        <div className='text-red-500'>Error loading teachers.</div>
      ) : (
        <DataTable
          table={table}
          className='w-fit'
          actionBar={<TeachersTableActionBar table={table} />}
        >
          <DataTableToolbar table={table} />
        </DataTable>
      )}
    </div>
  );
}
