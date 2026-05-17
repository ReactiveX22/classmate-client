"use client";

import { Button } from "@/components/ui/button";
import { CardAction } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUser } from "@/hooks/useAuth";
import { Edit2, Eye, MoreVertical, Trash2 } from "lucide-react";

interface PostCardActionsProps {
  authorId: string;
  onEdit?: () => void;
  onDelete?: () => void;
  onViewDetails?: () => void;
}

export function PostCardActions({
  authorId,
  onEdit,
  onDelete,
  onViewDetails,
}: PostCardActionsProps) {
  const { data: user } = useUser();

  const isAuthor = user && user.id === authorId;

  return (
    <CardAction>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="ghost" size="icon-sm">
              <MoreVertical />
            </Button>
          }
        />
        <DropdownMenuContent align="end">
          {onViewDetails && (
            <DropdownMenuItem onClick={onViewDetails}>
              <Eye />
              View details
            </DropdownMenuItem>
          )}
          {isAuthor && (
            <>
              <DropdownMenuItem onClick={onEdit}>
                <Edit2 />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem variant="destructive" onClick={onDelete}>
                <Trash2 />
                Delete
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </CardAction>
  );
}
