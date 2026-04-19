'use client';

import { format, isToday, isTomorrow } from 'date-fns';
import Link from 'next/link';

interface UpcomingItemProps {
  post: {
    id: string;
    title: string;
    type: 'assignment' | 'announcement' | 'material';
    dueAt: string;
    classroomId: string;
    classroomName: string;
  };
}

const colorPatterns = [
  'bg-indigo-500',
  'bg-blue-500',
  'bg-emerald-500',
  'bg-orange-500',
  'bg-rose-500',
  'bg-violet-500',
];

const getColor = (id: string) => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colorPatterns[Math.abs(hash) % colorPatterns.length];
};

export function UpcomingItem({ post }: UpcomingItemProps) {
  const colorClass = getColor(post.classroomId);
  const dueDate = new Date(post.dueAt);

  const getRelativeDate = (date: Date) => {
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'MMM d');
  };

  return (
    <Link
      href={`/dashboard/classrooms/${post.classroomId}/assignments/${post.id}`}
      className='group block p-3.5 hover:bg-muted/50 transition-all duration-200 border-l-3 border-transparent hover:border-primary'
    >
      <div className='flex items-center gap-3'>
        <div className={`size-2 rounded-full ${colorClass} shrink-0 shadow-sm`} />

        <div className='flex-1 min-w-0 space-y-0.5'>
          <p className='font-semibold text-sm line-clamp-1 group-hover:text-primary transition-colors'>
            {post.title}
          </p>
          <p className='text-xs text-muted-foreground line-clamp-1'>
            {post.classroomName} • {format(dueDate, 'h:mm a')}
          </p>
        </div>

        <div className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full border whitespace-nowrap ${isToday(dueDate)
          ? 'bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20'
          : 'bg-muted/50 text-muted-foreground border-transparent'
          }`}>
          {getRelativeDate(dueDate)}
        </div>
      </div>
    </Link>
  );
}
