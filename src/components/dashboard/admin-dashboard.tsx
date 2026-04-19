'use client';

import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useUser } from '@/hooks/useAuth';
import { IconCalendar } from '@tabler/icons-react';
import { format } from 'date-fns';
import { AddNoticeDialog } from '../notices/add-notice-dialog';
import { RecentNotices } from './recent-notices';

export function AdminDashboard() {
  const { data: user } = useUser();

  return (
    <div className='container mx-auto p-6 space-y-8 animate-in fade-in duration-500'>
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
        <div className='space-y-1'>
          <h1 className='text-xl font-semibold tracking-tight'>
            Welcome, {user?.name}
          </h1>
          <p className='text-muted-foreground'>
            {format(new Date(), 'EEEE, MMMM do, yyyy')}
          </p>
        </div>
        <AddNoticeDialog />
      </div>

      <div className='grid gap-6 lg:grid-cols-3'>
        <div className='lg:col-span-3 space-y-4'>
          <RecentNotices
            emptyAction={<AddNoticeDialog />}
            emptyDescription='Get started by creating your first notice.'
          />
        </div>
      </div>
    </div>
  );
}
