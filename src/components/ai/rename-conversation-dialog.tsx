"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useRenameConversation } from "@/hooks/use-rename-conversation";

interface RenameConversationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  conversationId: string;
  currentTitle: string;
}

export function RenameConversationDialog({
  open,
  onOpenChange,
  conversationId,
  currentTitle,
}: RenameConversationDialogProps) {
  const [title, setTitle] = useState(currentTitle);
  const renameConversation = useRenameConversation();

  useEffect(() => {
    if (open) {
      setTitle(currentTitle);
    }
  }, [open, currentTitle]);

  const handleRename = async () => {
    if (!conversationId || !title.trim()) {
      return;
    }
    await renameConversation.mutateAsync({
      id: conversationId,
      title: title.trim(),
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename Conversation</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter new title..."
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                void handleRename();
              }
            }}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleRename}
            disabled={renameConversation.isPending || !title.trim()}
          >
            {renameConversation.isPending ? "Renaming..." : "Rename"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
