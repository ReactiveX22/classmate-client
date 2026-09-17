import { DeleteConfirmDialog } from "@/components/common/delete-confirm-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { IconPlus } from "@tabler/icons-react";
import { useState } from "react";
import { CreatePostForm } from "./create-post-form";
import { PostType } from "@/lib/api/services/post.service";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface CreatePostDialogProps {
  classroomId: string;
  trigger?: React.ReactElement;
  defaultType?: PostType;
  hideTypeSelection?: boolean;
}

export function CreatePostDialog({
  classroomId,
  trigger,
  defaultType,
  hideTypeSelection,
}: CreatePostDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);
  const [formKey, setFormKey] = useState(0);

  const closeAndReset = () => {
    setShowDiscardConfirm(false);
    setIsDirty(false);
    setFormKey((k) => k + 1);
    setOpen(false);
  };

  const handleOpenChange = (next: boolean) => {
    // X / overlay / Escape with unsaved work -> confirm first.
    if (!next && isDirty && !isSubmitting) {
      setShowDiscardConfirm(true);
      return;
    }
    setOpen(next);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          trigger || (
            <Button size="sm" className="sm:px-3">
              <IconPlus className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Create Post</span>
            </Button>
          )
        }
      />
      <DialogContent
        className={cn(
          "sm:max-w-[700px] transition-[filter] duration-100",
          showDiscardConfirm && "brightness-[0.7]",
        )}
      >
        <DialogHeader>
          <DialogTitle>
            {defaultType
              ? `Create New ${defaultType.charAt(0).toUpperCase() + defaultType.slice(1)}`
              : "Create New Post"}
          </DialogTitle>
          <DialogDescription>
            {defaultType === "material"
              ? "Share learning materials and resources with your class."
              : "Share information, assignments, or questions with your class."}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[75vh] pr-4">
          <CreatePostForm
            key={formKey}
            classroomId={classroomId}
            defaultType={defaultType}
            hideTypeSelection={hideTypeSelection}
            onSuccess={closeAndReset}
            id="create-post-form"
            showFooter={false}
            onPendingChange={setIsSubmitting}
            onDirtyChange={setIsDirty}
          />
        </ScrollArea>
        <DialogFooter>
          <Button type="submit" form="create-post-form" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </DialogFooter>
      </DialogContent>

      <DeleteConfirmDialog
        open={showDiscardConfirm}
        onOpenChange={setShowDiscardConfirm}
        title="Discard changes?"
        description="You have unsaved changes. Are you sure you want to discard them?"
        confirmText="Discard"
        cancelText="Keep editing"
        variant="default"
        onConfirm={closeAndReset}
      />
    </Dialog>
  );
}
