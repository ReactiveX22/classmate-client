import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface TagBadgeProps {
  tag: string;
  className?: string;
}

const getTagColor = (tag: string) => {
  const normalizedTag = tag.toLowerCase();
  switch (normalizedTag) {
    case 'urgent':
      return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 hover:bg-red-100/80';
    case 'important':
      return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 hover:bg-amber-100/80';
    case 'announcement':
      return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 hover:bg-blue-100/80';
    default:
      return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-100/80';
  }
};

export function TagBadge({ tag, className }: TagBadgeProps) {
  return (
    <Badge
      variant='secondary'
      className={cn('capitalize font-normal', getTagColor(tag), className)}
    >
      {tag}
    </Badge>
  );
}
