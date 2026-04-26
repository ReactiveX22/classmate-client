'use client';

import { DataTable } from '@/components/data-table/data-table';
import { DataTableToolbar } from '@/components/data-table/data-table-toolbar';
import { useDataTable } from '@/hooks/use-data-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { PageHeader } from '@/components/common/page-header';
import { PlusIcon } from 'lucide-react';
import { useQueryState, parseAsInteger } from 'nuqs';
import { getSortingStateParser } from '@/lib/parsers';
import { useCallback, useEffect, useState } from 'react';
import { useDebouncedCallback } from '@/hooks/use-debounced-callback';

import { useSemesters } from '@/hooks/use-semesters';
import { semesterColumns } from './semester-columns';
import { Semester } from '@/lib/api/services/semester.service';
import { ExtendedColumnSort } from '@/types/data-table';

import { useCourseSessions } from '@/hooks/use-course-sessions';
import { courseSessionColumns } from './course-session-columns';
import { CourseSession } from '@/lib/api/services/course-session.service';
import { AddCourseSessionDialog } from '@/components/academic-sessions/add-course-session-dialog';
import { AddSemesterDialog } from '@/components/academic-sessions/add-semester-dialog';


const DEFAULT_SEMESTER_SORTING: ExtendedColumnSort<Semester>[] = [{ id: 'createdAt', desc: true }];
const DEFAULT_SESSION_SORTING: ExtendedColumnSort<CourseSession>[] = [{ id: 'createdAt', desc: true }];

// Custom hook to support namespaced query keys
function useNamespacedTableQueryState<TData>(
  prefix: string,
  defaultSorting: ExtendedColumnSort<TData>[] = []
) {
  const [page, setPage] = useQueryState(
    `${prefix}Page`,
    parseAsInteger.withDefault(1).withOptions({ clearOnDefault: true })
  );

  const [perPage, setPerPage] = useQueryState(
    `${prefix}PerPage`,
    parseAsInteger.withDefault(10).withOptions({ clearOnDefault: true })
  );

  const [sorting, setSorting] = useQueryState(
    `${prefix}Sort`,
    getSortingStateParser<TData>()
      .withDefault(defaultSorting)
      .withOptions({ clearOnDefault: true })
  );

  return {
    page,
    setPage,
    perPage,
    setPerPage,
    sorting,
    setSorting,
  };
}

function SemestersSection() {
  const { page, perPage, sorting } = useNamespacedTableQueryState<Semester>('sem', DEFAULT_SEMESTER_SORTING);

  const [search, setSearch] = useQueryState('semSearch', {
    defaultValue: '',
    clearOnDefault: true,
    history: 'replace',
    shallow: true,
  });
  const [localSearch, setLocalSearch] = useState(search);
  useEffect(() => { setLocalSearch(search); }, [search]);

  const debouncedSetSearch = useDebouncedCallback((value: string) => {
    setSearch(value || null);
  }, 400);

  const onSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearch(e.target.value);
    debouncedSetSearch(e.target.value);
  }, [debouncedSetSearch]);

  const { data: response, isFetching, isError } = useSemesters({
    page,
    limit: perPage,
    sortBy: (sorting[0]?.id as string) || undefined,
    sortOrder: sorting[0]?.desc ? 'desc' : 'asc',
    search: search || undefined,
  });

  const semesters = response?.data || [];
  const pageCount = response?.meta?.totalPages || 1;

  const { table } = useDataTable({
    data: semesters,
    columns: semesterColumns,
    pageCount,
    initialState: { sorting: DEFAULT_SEMESTER_SORTING },
    clearOnDefault: true,
    queryKeys: {
      page: 'semPage',
      perPage: 'semPerPage',
      sort: 'semSort',
    }
  });

  const [showAddSemesterDialog, setShowAddSemesterDialog] = useState(false);

  return (
    <div className='flex flex-col gap-4 border rounded-lg p-4 bg-background w-full overflow-hidden xl:col-span-1'>
      <div className='flex items-center justify-between'>
        <h2 className='text-lg font-semibold'>Semesters</h2>
        <Button size='sm' onClick={() => setShowAddSemesterDialog(true)}>
          <PlusIcon className='h-4 w-4 mr-2' /> Add
        </Button>
      </div>
      {isError ? (
        <div className='text-red-500 text-sm'>Error loading semesters.</div>
      ) : (
        <DataTable table={table} isFetching={isFetching} hidePagination>
          <DataTableToolbar table={table} hideViewOptions searchInput={
            <div className='relative w-full max-w-[200px]'>
              <Search className='absolute top-2 left-2 h-4 w-4 text-muted-foreground' />
              <Input
                placeholder='Search semesters...'
                value={localSearch}
                onChange={onSearchChange}
                className='h-8 pl-8'
              />
            </div>
          } />
        </DataTable>
      )}
      <AddSemesterDialog open={showAddSemesterDialog} onOpenChange={setShowAddSemesterDialog} />
    </div>
  );
}

function CourseSessionsSection() {
  const { page, perPage, sorting } = useNamespacedTableQueryState<CourseSession>('cs', DEFAULT_SESSION_SORTING);

  const [search, setSearch] = useQueryState('csSearch', {
    defaultValue: '',
    clearOnDefault: true,
    history: 'replace',
    shallow: true,
  });
  const [localSearch, setLocalSearch] = useState(search);
  useEffect(() => { setLocalSearch(search); }, [search]);

  const debouncedSetSearch = useDebouncedCallback((value: string) => {
    setSearch(value || null);
  }, 400);

  const onSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearch(e.target.value);
    debouncedSetSearch(e.target.value);
  }, [debouncedSetSearch]);

  const { data: response, isFetching, isError } = useCourseSessions({
    page,
    limit: perPage,
    sortBy: (sorting[0]?.id as string) || undefined,
    sortOrder: sorting[0]?.desc ? 'desc' : 'asc',
    search: search || undefined,
  });

  const sessions = response?.data || [];
  const pageCount = response?.meta?.totalPages || 1;

  const { table } = useDataTable({
    data: sessions,
    columns: courseSessionColumns,
    pageCount,
    initialState: { sorting: DEFAULT_SESSION_SORTING },
    clearOnDefault: true,
    queryKeys: {
      page: 'csPage',
      perPage: 'csPerPage',
      sort: 'csSort',
    }
  });

  const [showAddSessionDialog, setShowAddSessionDialog] = useState(false);

  return (
    <div className='flex flex-col gap-4 border rounded-lg p-4 bg-background w-full overflow-hidden xl:col-span-2'>
      <div className='flex items-center justify-between'>
        <h2 className='text-lg font-semibold'>Sessions</h2>
        <Button size='sm' onClick={() => setShowAddSessionDialog(true)}>
          <PlusIcon className='h-4 w-4 mr-2' /> Add
        </Button>
      </div>
      {isError ? (
        <div className='text-red-500 text-sm'>Error loading course sessions.</div>
      ) : (
        <DataTable table={table} isFetching={isFetching}>
          <DataTableToolbar table={table} searchInput={
            <div className='relative w-full max-w-[200px]'>
              <Search className='absolute top-2 left-2 h-4 w-4 text-muted-foreground' />
              <Input
                placeholder='Search sessions...'
                value={localSearch}
                onChange={onSearchChange}
                className='h-8 pl-8'
              />
            </div>
          } />
        </DataTable>
      )}
      <AddCourseSessionDialog open={showAddSessionDialog} onOpenChange={setShowAddSessionDialog} />
    </div>
  );
}

export default function AcademicSessionsPage() {
  return (
    <div className='flex flex-col gap-6 p-6'>
      <PageHeader
        title='Academic Sessions'
        description='Manage semesters and course sessions for your organization.'
      />

      <div className='grid grid-cols-1 xl:grid-cols-3 gap-6 items-start'>
        <CourseSessionsSection />
        <SemestersSection />
      </div>
    </div>
  );
}
