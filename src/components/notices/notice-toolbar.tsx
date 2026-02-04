'use client';

import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Role } from '@/types/auth';
import { Plus, Search } from 'lucide-react';
import Link from 'next/link';
import { RoleGuard } from '../common/role-guard';

interface NoticeToolbarProps {
  searchPromise: string;
  onSearchChange: (value: string) => void;
}

export function NoticeToolbar({
  searchPromise,
  onSearchChange,
}: NoticeToolbarProps) {
  return (
    <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between py-4 border-b px-6 bg-card'>
      <h2 className='text-lg font-semibold'>Notices</h2>
      <div className='flex items-center gap-2'>
        <div className='relative'>
          <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
          <Input
            placeholder='Search...'
            className='pl-9 w-[250px] bg-muted/50'
            value={searchPromise}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <RoleGuard allowedRoles={[Role.Admin]}>
          <Link
            href='/dashboard/notices/new'
            className={buttonVariants({ variant: 'default', size: 'default' })}
          >
            <Plus className='mr-2 h-4 w-4' />
            Publish Notice
          </Link>
        </RoleGuard>
      </div>
    </div>
  );
}
