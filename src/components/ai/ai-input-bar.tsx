"use client";

import { ArrowUp, MoreHorizontal, Pencil, Square, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { DeleteConfirmDialog } from "@/components/common/delete-confirm-dialog";
import { Button } from "@/components/ui/button";
import {
  PromptInput,
  PromptInputAction,
  PromptInputActions,
  PromptInputTextarea,
} from "@/components/ui/chat/prompt-input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useDeleteConversation } from "@/hooks/use-delete-conversation";
import { useRenameConversation } from "@/hooks/use-rename-conversation";

interface AiInputBarProps {
  isStreaming: boolean;
  onSend: (message: string) => void | Promise<void>;
  onStop: () => void;
  conversationId?: string;
  currentTitle?: string | null;
}

export function AiInputBar({
  isStreaming,
  onSend,
  onStop,
  conversationId,
  currentTitle,
}: AiInputBarProps) {
  const [message, setMessage] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const router = useRouter();

  const deleteConversation = useDeleteConversation();
  const renameConversation = useRenameConversation();

  useEffect(() => {
    if (currentTitle) {
      setNewTitle(currentTitle);
    }
  }, [currentTitle]);

  const canSend = message.trim().length > 0 && !isStreaming;

  const handleSubmit = async () => {
    if (!canSend) {
      return;
    }

    const nextMessage = message.trim();
    setMessage("");
    await onSend(nextMessage);
  };

  const handleDelete = async () => {
    if (!conversationId) {
      return;
    }
    router.push("/dashboard/ai");
    await deleteConversation.mutateAsync(conversationId);
    setIsDeleteDialogOpen(false);
  };

  const handleRename = async () => {
    if (!conversationId || !newTitle.trim()) {
      return;
    }
    await renameConversation.mutateAsync({
      id: conversationId,
      title: newTitle.trim(),
    });
    setIsRenameDialogOpen(false);
  };

  return (
    <>
      <PromptInput
        className="border-input bg-popover relative z-10 w-full rounded-3xl border p-0 shadow-xs"
        isLoading={isStreaming}
        onSubmit={handleSubmit}
        value={message}
        onValueChange={setMessage}
      >
        <div className="flex flex-col">
          <PromptInputTextarea
            autoFocus
            className="min-h-[44px] rounded-none rounded-t-3xl px-4 pt-3 pl-4 text-base text-primary-foreground leading-[1.3]"
            disabled={isStreaming}
            placeholder="Ask anything"
          />

          <PromptInputActions className="mt-5 flex w-full items-center justify-between gap-2 px-3 pb-3">
            <div className="flex items-center gap-2">
              {conversationId && (
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        <MoreHorizontal size={18} />
                      </Button>
                    }
                  />
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsRenameDialogOpen(true);
                      }}
                    >
                      <Pencil className="mr-2 h-4 w-4" />
                      Rename
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            <PromptInputAction
              tooltip={isStreaming ? "Stop generation" : "Send message"}
            >
              <Button
                className="size-9 rounded-full"
                disabled={!canSend && !isStreaming}
                onClick={isStreaming ? onStop : handleSubmit}
                size="icon"
                type="button"
              >
                {isStreaming ? <Square /> : <ArrowUp />}
              </Button>
            </PromptInputAction>
          </PromptInputActions>
        </div>
      </PromptInput>

      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDelete}
        isLoading={deleteConversation.isPending}
      />

      <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Conversation</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Enter new title..."
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  void handleRename();
                }
              }}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsRenameDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleRename}
              disabled={renameConversation.isPending || !newTitle.trim()}
            >
              {renameConversation.isPending ? "Renaming..." : "Rename"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
