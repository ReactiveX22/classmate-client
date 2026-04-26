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
import { useQueryState } from 'nuqs';
import { useCallback, useEffect, useState } from 'react';
import { useDebouncedCallback } from '@/hooks/use-debounced-callback';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

const DEFAULT_SORTING: ExtendedColumnSort<StudentData>[] = [
  { id: 'createdAt', desc: true },
];

export default function StudentsPage() {
  const { page, perPage, sorting } =
    useTableQueryState<StudentData>(DEFAULT_SORTING);

  const [search, setSearch] = useQueryState('search', {
    defaultValue: '',
    clearOnDefault: true,
    history: 'replace',
    shallow: true,
  });

  const [localSearch, setLocalSearch] = useState(search);

  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  const debouncedSetSearch = useDebouncedCallback((value: string) => {
    setSearch(value || null);
  }, 400);

  const onSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setLocalSearch(e.target.value);
      debouncedSetSearch(e.target.value);
    },
    [debouncedSetSearch]
  );

  const {
    data: response,
    isFetching,
    isError,
  } = useStudents({
    page,
    limit: perPage,
    sortBy: (sorting[0]?.id as string) || undefined,
    sortOrder: sorting[0]?.desc ? 'desc' : 'asc',
    search: search || undefined,
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

      {isError ? (
        <div className='text-red-500'>Error loading students.</div>
      ) : (
        <DataTable
          table={table}
          className='w-fit'
          isFetching={isFetching}
          actionBar={<StudentsTableActionBar table={table} />}
        >
          <DataTableToolbar table={table} searchInput={
            <div className='relative w-64'>
              <Search className='absolute top-2.5 left-2 h-4 w-4 text-muted-foreground' />
              <Input
                placeholder='Search students...'
                value={localSearch}
                onChange={onSearchChange}
                className='h-8 pl-8'
              />
            </div>
          } />
        </DataTable>
      )}
    </div>
  );
}
