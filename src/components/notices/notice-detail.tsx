'use client';

import { DeleteConfirmDialog } from '@/components/common/delete-confirm-dialog';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useDeleteNotice } from '@/hooks/use-notices';
import { NoticeData } from '@/lib/api/services/notice.service';
import { Role } from '@/types/auth';
import { format } from 'date-fns';
import { Calendar, LayoutTemplate, MoreVertical, User } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';
import { RoleGuard } from '../common/role-guard';
import { TagBadge } from './tag-badge';

interface NoticeDetailProps {
  data: NoticeData | null;
}

export function NoticeDetail({ data }: NoticeDetailProps) {
  const [showDelete, setShowDelete] = useState(false);

  const { mutateAsync: deleteNotice, isPending: isDeleting } =
    useDeleteNotice();

  if (!data || !data.notice) {
    return (
      <div className='flex flex-col items-center justify-center h-full text-muted-foreground p-8 bg-muted/5'>
        <div className='h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4'>
          <LayoutTemplate className='h-8 w-8 opacity-50' />
        </div>
        <h3 className='text-lg font-medium text-foreground'>
          No Notice Selected
        </h3>
        <p className='text-sm max-w-[280px] text-center mt-2'>
          Select a notice from the list to view its details, or create a new one
          to get started.
        </p>
      </div>
    );
  }

  const { notice, author } = data;

  const handleDelete = async () => {
    try {
      await deleteNotice(notice.id);
      setShowDelete(false);
      toast.success('Notice deleted successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete notice');
    }
  };

  return (
    <div className='flex flex-col h-full bg-card'>
      <div className='flex flex-col gap-2 p-4 border-b'>
        <div className='flex items-center justify-between gap-2'>
          <h1 className='text-lg font-semibold leading-none'>{notice.title}</h1>

          <RoleGuard allowedRoles={[Role.Admin]}>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button variant='ghost' size='icon-sm'>
                    <MoreVertical />
                    <span className='sr-only'>Actions</span>
                  </Button>
                }
              />
              <DropdownMenuContent align='end'>
                <DropdownMenuItem
                  render={
                    <Link href={`/dashboard/notices/${notice.id}/edit`}>
                      Edit Notice
                    </Link>
                  }
                />
                <DropdownMenuItem
                  onClick={() => setShowDelete(true)}
                  className='text-destructive focus:text-destructive'
                >
                  Delete Notice
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </RoleGuard>
        </div>

        <div className='flex flex-wrap gap-y-2 gap-x-6 text-xs text-muted-foreground'>
          <div className='flex items-center gap-2'>
            <User className='h-4 w-4' />
            <span className='text-foreground'>{author?.name || 'Admin'}</span>
          </div>
          <div className='flex items-center gap-2'>
            <Calendar className='h-4 w-4' />
            <span className='text-foreground'>
              {format(new Date(notice.createdAt), 'MMMM dd, yyyy')}
            </span>
          </div>
        </div>

        <div className='flex items-center gap-2 flex-wrap mt-1'>
          {notice.tags.map((tag) => (
            <TagBadge key={tag} tag={tag} />
          ))}
        </div>
      </div>

      <ScrollArea className='flex-1 min-h-0 p-4'>
        <div className='text-sm leading-relaxed max-w-4xl mx-auto space-y-6'>
          <div className='whitespace-pre-wrap font-sans text-base'>
            {notice.content || 'No content provided.'}
          </div>

          {/* Placeholder for attachments if needed later */}
          {notice.attachments && notice.attachments.length > 0 && (
            <div className='pt-6'>
              <h4 className='text-sm font-medium mb-3'>Attachments</h4>
              {/* Attachment list would go here */}
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Dialogs controlled by internal state, rendering only when needed */}
      <RoleGuard allowedRoles={[Role.Admin]}>
        <DeleteConfirmDialog
          open={showDelete}
          onOpenChange={setShowDelete}
          title='Delete Notice'
          description={
            <span>
              Are you sure you want to delete{' '}
              <span className='font-semibold'>"{notice.title}"</span>? This
              action cannot be undone.
            </span>
          }
          onConfirm={handleDelete}
          isLoading={isDeleting}
          confirmText='Delete'
          variant='destructive'
        />
      </RoleGuard>
    </div>
  );
}
