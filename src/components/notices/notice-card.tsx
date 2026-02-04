'use client';

import { format } from 'date-fns';
import { Calendar, ChevronRight, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NoticeData } from '@/lib/api/services/notice.service';
import { TagBadge } from './tag-badge';

interface NoticeCardProps {
  notice: NoticeData;
  isSelected?: boolean;
  onClick?: () => void;
}

export function NoticeCard({
  notice: data,
  isSelected,
  onClick,
}: NoticeCardProps) {
  const { notice, author } = data;

  return (
    <div
      onClick={onClick}
      className={cn(
        'group flex flex-col gap-3 p-4 rounded-xl border bg-card hover:bg-accent/50 cursor-pointer transition-all',
        isSelected &&
          'border-primary bg-accent/50 ring-1 ring-primary/20 shadow-sm',
      )}
    >
      <div className='flex items-start justify-between gap-2'>
        <h3
          className={cn(
            'font-medium line-clamp-2 leading-tight',
            isSelected && 'text-primary',
          )}
        >
          {notice.title}
        </h3>
        <ChevronRight
          className={cn(
            'h-4 w-4 text-muted-foreground transition-transform opacity-0 group-hover:opacity-100',
            isSelected && 'opacity-100 text-primary',
          )}
        />
      </div>

      <div className='flex items-center gap-3 text-xs text-muted-foreground'>
        <div className='flex items-center gap-1.5'>
          <User className='h-3.5 w-3.5' />
          <span>{author?.name || 'Admin'}</span>
        </div>

        <div className='flex items-center gap-1.5'>
          <Calendar className='h-3.5 w-3.5' />
          <span>{format(new Date(notice.createdAt), 'dd MMM, yyyy')}</span>
        </div>
      </div>

      {notice.tags && notice.tags.length > 0 && (
        <div className='flex flex-wrap gap-1.5 mt-1'>
          {notice.tags.slice(0, 3).map((tag) => (
            <TagBadge key={tag} tag={tag} className='text-[10px] px-1.5 h-5' />
          ))}
          {notice.tags.length > 3 && (
            <span className='text-[10px] text-muted-foreground self-center px-1'>
              +{notice.tags.length - 3}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
