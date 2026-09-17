"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { DeleteConfirmDialog } from "@/components/common/delete-confirm-dialog";
import { useEditPost } from "@/hooks/use-edit-post";
import { Post, SubmissionType } from "@/lib/api/services/post.service";
import { PostForm, PostFormData } from "./post-form";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface EditPostDialogProps {
  post: Post;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EDIT_COPY: Record<Post["type"], { title: string; description: string }> =
  {
    announcement: {
      title: "Edit Announcement",
      description: "Update the announcement details below.",
    },
    assignment: {
      title: "Edit Assignment",
      description: "Update the assignment details below.",
    },
    material: {
      title: "Edit Material",
      description: "Update the learning material below.",
    },
    question: {
      title: "Edit Question",
      description: "Update the question details below.",
    },
  };

export function EditPostDialog({
  post,
  open,
  onOpenChange,
}: EditPostDialogProps) {
  const { mutateAsync: updatePost, isPending } = useEditPost();
  const [isDirty, setIsDirty] = useState(false);
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);
  const [formKey, setFormKey] = useState(0);

  const closeAndReset = () => {
    setShowDiscardConfirm(false);
    setIsDirty(false);
    setFormKey((k) => k + 1);
    onOpenChange(false);
  };

  const handleOpenChange = (next: boolean) => {
    // X / overlay / Escape with unsaved work -> confirm first.
    if (!next && isDirty && !isPending) {
      setShowDiscardConfirm(true);
      return;
    }
    onOpenChange(next);
  };

  const initialValues: PostFormData = {
    type: post.type,
    content: post.content,
    isPinned: !!post.isPinned,
    commentsEnabled: post.commentsEnabled ?? true,
    title: post.title || "",
    tags: post.tags || [],
    questionData:
      post.type === "question"
        ? post.questionData?.mode === "poll"
          ? {
              mode: "poll",
              selectionMode: post.questionData.selectionMode,
              options: post.questionData.options.map((option) => ({
                id: option.id,
                text: option.text,
                position: option.position,
              })),
            }
          : {
              mode: "short_answer",
            }
        : undefined,
    assignmentData:
      post.type === "assignment"
        ? {
            dueDate: post.assignmentData?.dueDate
              ? new Date(post.assignmentData.dueDate)
              : undefined,
            points: post.assignmentData?.points ?? 100,
            submissionType:
              post.assignmentData?.submissionType ?? ("file" as SubmissionType),
            allowLateSubmission:
              post.assignmentData?.allowLateSubmission ?? true,
          }
        : undefined,
  } as PostFormData;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className={cn(
          "sm:max-w-[700px] transition-[filter] duration-100",
          showDiscardConfirm && "brightness-[0.7]",
        )}
      >
        <DialogHeader>
          <DialogTitle>{EDIT_COPY[post.type].title}</DialogTitle>
          <DialogDescription>
            {EDIT_COPY[post.type].description}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[75vh] pr-4">
          <PostForm
            key={formKey}
            id="edit-post-form"
            showFooter={false}
            classroomId={post.classroomId}
            initialValues={initialValues}
            hideTypeSelection={true}
            lockQuestionPollStructure={
              post.questionData?.mode === "poll" &&
              (post.questionData.votes?.length ?? 0) > 0
            }
            initialAttachments={post.attachments.map((att) => ({
              id: att.id,
              name: att.name,
              url: att.url,
              type: att.type,
              size: att.size || 0,
              mimeType: att.mimeType || "",
            }))}
            onSubmit={async (data) => {
              await updatePost({
                classroomId: post.classroomId,
                postId: post.id,
                data,
              });
              closeAndReset();
            }}
            isSubmitting={isPending}
            submitLabel="Save Changes"
            onDirtyChange={setIsDirty}
          />
        </ScrollArea>
        <DialogFooter>
          <Button type="submit" form="edit-post-form" disabled={isPending}>
            {isPending ? "Submitting..." : "Submit"}
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
