'use client';

import { Input } from '@/components/ui/input';
import { Role } from '@/types/auth';
import { Search } from 'lucide-react';
import { RoleGuard } from '../common/role-guard';
import { AddNoticeDialog } from './add-notice-dialog';

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
          <AddNoticeDialog />
        </RoleGuard>
      </div>
    </div>
  );
}
