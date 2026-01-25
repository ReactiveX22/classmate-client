'use client';

import { Button } from '@/components/ui/button';
import { CardAction } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useUser } from '@/hooks/useAuth';
import { Edit2, MoreVertical, Trash2 } from 'lucide-react';

interface PostCardActionsProps {
  authorId: string;
  onEdit: () => void;
  onDelete: () => void;
}

export function PostCardActions({
  authorId,
  onEdit,
  onDelete,
}: PostCardActionsProps) {
  const { data: user } = useUser();

  // Only show actions if the current user is the author
  if (!user || user.id !== authorId) {
    return null;
  }

  return (
    <CardAction>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant='ghost' size='icon-sm'>
              <MoreVertical />
            </Button>
          }
        />
        <DropdownMenuContent align='end'>
          <DropdownMenuItem onClick={onEdit}>
            <Edit2 />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem variant='destructive' onClick={onDelete}>
            <Trash2 />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </CardAction>
  );
}
