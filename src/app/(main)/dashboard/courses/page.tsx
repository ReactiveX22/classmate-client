'use client';

import { DataTable } from '@/components/data-table/data-table';
import { DataTableToolbar } from '@/components/data-table/data-table-toolbar';
import { useDataTable } from '@/hooks/use-data-table';
import { useTableQueryState } from '@/hooks/use-table-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import Link from 'next/link';
import { getColumns } from './columns';
import { Course } from '@/lib/api/services/course.service';
import { ExtendedColumnSort } from '@/types/data-table';
import { useCourses } from '@/hooks/use-courses';
import { PageHeader } from '@/components/common/page-header';
import { PlusIcon } from 'lucide-react';
import { CoursesTableActionBar } from '@/components/courses/courses-table-action-bar';
import { useDebouncedCallback } from '@/hooks/use-debounced-callback';
import { useSemesters } from '@/hooks/use-semesters';
import { useCourseSessions } from '@/hooks/use-course-sessions';
import { parseAsString, parseAsArrayOf } from 'nuqs';
import { useCallback, useEffect, useMemo, useState } from 'react';

const toOptions = <T extends { id: string }>(
  data: T[],
  labelKey: keyof T | ((item: T) => string)
) =>
  data.map((item) => ({
    label: typeof labelKey === 'function' ? labelKey(item) : (item[labelKey] as string),
    value: item.id,
  }));

const DEFAULT_SORTING: ExtendedColumnSort<Course>[] = [
  { id: 'createdAt', desc: true },
];

export default function CoursesPage() {
  interface CourseFilters {
    search: string;
    semesterId: string[];
    sessionId: string[];
  }

  const {
    page,
    perPage,
    sorting,
    filters,
    setFilters
  } = useTableQueryState<Course, CourseFilters>(DEFAULT_SORTING, {
    search: parseAsString.withDefault('').withOptions({ clearOnDefault: true }),
    semesterId: parseAsArrayOf(parseAsString).withDefault([]).withOptions({ clearOnDefault: true }),
    sessionId: parseAsArrayOf(parseAsString).withDefault([]).withOptions({ clearOnDefault: true }),
  });

  const { search, semesterId, sessionId } = filters;

  const [localSearch, setLocalSearch] = useState(search);

  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  const debouncedSetSearch = useDebouncedCallback((value: string) => {
    setFilters({ search: value || null });
  }, 400);

  const onSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setLocalSearch(e.target.value);
      debouncedSetSearch(e.target.value);
    },
    [debouncedSetSearch]
  );

  const { data: semesterResponse } = useSemesters({ limit: 100 });
  const { data: sessionResponse } = useCourseSessions({ limit: 100 });

  const semesterOptions = useMemo(
    () => toOptions(semesterResponse?.data || [], (s) => `Semester ${s.ordinal}`),
    [semesterResponse]
  );

  const sessionOptions = useMemo(
    () => toOptions(sessionResponse?.data || [], 'name'),
    [sessionResponse]
  );

  const {
    data: response,
    isFetching,
    isError,
  } = useCourses({
    page,
    limit: perPage,
    sortBy: sorting[0]?.id as keyof Course,
    sortOrder: sorting[0]?.desc ? 'desc' : 'asc',
    search: search || undefined,
    semesterId: semesterId.length > 0 ? semesterId : undefined,
    sessionId: sessionId.length > 0 ? sessionId : undefined,
  });

  const courses = response?.data || [];
  const pageCount = response?.meta?.totalPages || 1;

  const columns = useMemo(
    () => getColumns(semesterOptions, sessionOptions),
    [semesterOptions, sessionOptions]
  );

  const { table } = useDataTable({
    data: courses,
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
        title='Courses'
        description='Manage all courses in your organization.'
      >
        <Button
          nativeButton={false}
          render={<Link href='/dashboard/courses/new' />}
        >
          <PlusIcon /> Add Course
        </Button>
      </PageHeader>

      {isError ? (
        <div className='text-red-500'>Error loading courses.</div>
      ) : (
        <DataTable
          table={table}
          className='w-fit'
          isFetching={isFetching}
          actionBar={<CoursesTableActionBar table={table} />}
        >
          <DataTableToolbar table={table} searchInput={
            <div className='relative w-64'>
              <Search className='absolute top-2.5 left-2 h-4 w-4 text-muted-foreground' />
              <Input
                placeholder='Search courses...'
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
