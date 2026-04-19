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
import { useQueryState } from 'nuqs';
import { useCallback, useEffect, useState } from 'react';
import { useDebouncedCallback } from '@/hooks/use-debounced-callback';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

const DEFAULT_SORTING: ExtendedColumnSort<TeacherData>[] = [
  { id: 'createdAt', desc: true },
];

export default function TeachersPage() {
  const { page, perPage, sorting } =
    useTableQueryState<TeacherData>(DEFAULT_SORTING);

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
  } = useTeachers({
    page,
    limit: perPage,
    sortBy: sorting[0]?.id as any,
    sortOrder: sorting[0]?.desc ? 'desc' : 'asc',
    search: search || undefined,
  });

  const teachers = response?.data || [];
  const pageCount = response?.meta?.totalPages || 1;

  const { table } = useDataTable({
    data: teachers,
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

      {isError ? (
        <div className='text-red-500'>Error loading teachers.</div>
      ) : (
        <DataTable
          table={table}
          className='w-fit'
          isFetching={isFetching}
          actionBar={<TeachersTableActionBar table={table} />}
        >
          <DataTableToolbar table={table} searchInput={
            <div className='relative w-64'>
              <Search className='absolute top-2.5 left-2 h-4 w-4 text-muted-foreground' />
              <Input
                placeholder='Search teachers...'
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
