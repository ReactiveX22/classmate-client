'use client';

import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { useStudents } from '@/hooks/use-students';
import { IconUserPlus } from '@tabler/icons-react';
import { useState } from 'react';
import { columns } from './columns';

export default function StudentsPage() {
  const [pagination, setPagination] = useState({
    pageIndex: 0, // TanStack table is 0-indexed
    pageSize: 10,
  });

  const {
    data: response,
    isLoading,
    isError,
  } = useStudents({
    page: pagination.pageIndex + 1, // API is 1-indexed
    limit: pagination.pageSize,
  });

  const students = response?.data || [];
  const pageCount = response?.meta?.totalPages || 0;

  return (
    <div className='flex flex-col gap-6 p-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Students</h1>
          <p className='text-muted-foreground'>
            Manage all students in your organization.
          </p>
        </div>
        <Button>
          <IconUserPlus className='mr-2 h-4 w-4' />
          Add Student
        </Button>
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : isError ? (
        <div className='text-red-500'>Error loading students.</div>
      ) : (
        <DataTable
          columns={columns}
          data={students}
          searchKey='name'
          pageCount={pageCount}
          pagination={pagination}
          onPaginationChange={setPagination}
        />
      )}
    </div>
  );
}
