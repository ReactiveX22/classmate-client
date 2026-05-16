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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
      <DialogContent className="sm:max-w-[600px] ">
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
            classroomId={classroomId}
            defaultType={defaultType}
            hideTypeSelection={hideTypeSelection}
            onSuccess={() => {
              setOpen(false);
            }}
            id="create-post-form"
            showFooter={false}
            onPendingChange={setIsSubmitting}
          />
        </ScrollArea>
        <DialogFooter>
          <Button type="submit" form="create-post-form" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
