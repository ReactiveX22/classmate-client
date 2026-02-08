'use client';

import { DataTable } from '@/components/data-table/data-table';
import { DataTableToolbar } from '@/components/data-table/data-table-toolbar';
import { useDataTable } from '@/hooks/use-data-table';
import { useTableQueryState } from '@/hooks/use-table-query';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { columns } from './columns';
import { Course } from '@/lib/api/services/course.service';
import { ExtendedColumnSort } from '@/types/data-table';
import { useCourses } from '@/hooks/use-courses';
import { PageHeader } from '@/components/common/page-header';
import { PlusIcon } from 'lucide-react';
import { CoursesTableActionBar } from '@/components/courses/courses-table-action-bar';

const DEFAULT_SORTING: ExtendedColumnSort<Course>[] = [
  { id: 'createdAt', desc: true },
];

export default function CoursesPage() {
  const { page, perPage, sorting } =
    useTableQueryState<Course>(DEFAULT_SORTING);

  const {
    data: response,
    isLoading,
    isError,
  } = useCourses({
    page,
    limit: perPage,
    sortBy: sorting[0]?.id as any,
    sortOrder: sorting[0]?.desc ? 'desc' : 'asc',
  });

  const courses = response?.data || [];
  const pageCount = response?.meta?.totalPages || 1;

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

      {isLoading ? (
        <div>Loading...</div>
      ) : isError ? (
        <div className='text-red-500'>Error loading courses.</div>
      ) : (
        <DataTable
          table={table}
          className='w-fit'
          actionBar={<CoursesTableActionBar table={table} />}
        >
          <DataTableToolbar table={table} />
        </DataTable>
      )}
    </div>
  );
}
