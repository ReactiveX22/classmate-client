import { AttachmentUpload } from "@/components/common/attachment-upload";
import { AttachmentDisplay } from "@/components/classrooms/classroom-detail/posts/post-types/attachment-display";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { useCreateSubmission } from "@/hooks/use-create-submission";
import { useRemoveSubmissionAttachment } from "@/hooks/use-remove-submission-attachment";
import { useUnsubmit } from "@/hooks/use-unsubmit";
import {
  UploadResult,
  useUploadAttachment,
} from "@/hooks/use-upload-attachment";
import { AssignmentData, postService } from "@/lib/api/services/post.service";
import { Submission } from "@/lib/api/services/submission.service";
import { cn } from "@/lib/utils";
import {
  IconCheck,
  IconFilePlus,
  IconLoader2,
  IconPlus,
} from "@tabler/icons-react";
import { format } from "date-fns";
import { useEffect, useState, type ComponentProps, type ReactNode } from "react";

interface StudentWorkCardProps {
  classroomId: string;
  postId: string;
  assignmentData?: AssignmentData | null;
  submission?: Submission | null;
}

type SubmissionStatus = Submission["status"];

const STATUS_BADGE_STYLES: Record<
  Exclude<SubmissionStatus, "assigned">,
  string
> = {
  turned_in:
    "text-green-700 bg-green-100 dark:bg-green-900/30 dark:text-green-400",
  graded:
    "text-purple-700 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400",
  returned: "text-gray-700 bg-gray-100 dark:bg-gray-900/30 dark:text-gray-400",
};

const STATUS_BADGE_LABELS: Record<
  Exclude<SubmissionStatus, "assigned">,
  string
> = {
  turned_in: "Turned in",
  graded: "Graded",
  returned: "Returned",
};

function StatusBadge({ status }: { status?: SubmissionStatus | null }) {
  if (!status || status === "assigned") {
    return (
      <Badge
        variant="secondary"
        className="text-xs font-normal text-muted-foreground bg-muted hover:bg-muted"
      >
        Assigned
      </Badge>
    );
  }

  const style = STATUS_BADGE_STYLES[status];
  if (!style) return null;

  return (
    <Badge className={cn("text-xs font-medium", style)}>
      {STATUS_BADGE_LABELS[status]}
    </Badge>
  );
}

function WorkCardShell({
  status,
  children,
}: {
  status?: SubmissionStatus | null;
  children: ReactNode;
}) {
  return (
    <Card size="sm" className="shadow-sm">
      <CardHeader className="flex flex-col gap-2 items-start sm:flex-row sm:items-center sm:justify-between">
        <CardTitle className="text-base">Your work</CardTitle>
        <StatusBadge status={status} />
      </CardHeader>
      <CardContent className="space-y-3">{children}</CardContent>
    </Card>
  );
}

function FieldBlock({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      {children}
    </div>
  );
}

function MutedText({ children }: { children: ReactNode }) {
  return (
    <p className="text-sm whitespace-pre-wrap bg-muted/30 rounded-lg p-3">
      {children}
    </p>
  );
}

type ActionButtonProps = ComponentProps<typeof Button> & {
  pending?: boolean;
  pendingLabel?: string;
};

function ActionButton({
  pending = false,
  pendingLabel,
  children,
  disabled,
  ...rest
}: ActionButtonProps) {
  return (
    <Button {...rest} disabled={disabled || pending}>
      {pending ? (
        <>
          <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
          {pendingLabel}
        </>
      ) : (
        children
      )}
    </Button>
  );
}

export function StudentWorkCard({
  classroomId,
  postId,
  assignmentData,
  submission,
}: StudentWorkCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState("");
  const [attachments, setAttachments] = useState<UploadResult[]>([]);
  const [isAddingAttachment, setIsAddingAttachment] = useState(false);

  const { mutate: createSubmission, isPending: isSubmitting } =
    useCreateSubmission();
  const { mutate: unsubmit, isPending: isUnsubmitting } = useUnsubmit();
  const { mutateAsync: removeSubmissionAttachment } =
    useRemoveSubmissionAttachment();
  const { mutateAsync: uploadFile } = useUploadAttachment();

  useEffect(() => {
    if (submission && submission.status === "assigned") {
      setContent(submission.content || "");
      setAttachments((submission.attachments as UploadResult[]) || []);
      setIsEditing(true);
    } else if (!submission) {
      setContent("");
      setAttachments([]);
      setIsAddingAttachment(false);
      setIsEditing(false); // Default state handles the "Add or create" button
    } else {
      setIsEditing(false); // Submitted state
    }
  }, [submission]);

  const submissionType = assignmentData?.submissionType || "file";
  const allowsText = submissionType === "text" || submissionType === "multiple";
  const allowsFiles =
    submissionType === "file" || submissionType === "multiple";

  const handleSubmit = () => {
    createSubmission(
      {
        classroomId,
        postId,
        data: {
          content: content.trim() || undefined,
          attachments:
            attachments.length > 0
              ? attachments.map((a) => ({
                  id: a.id,
                  name: a.name,
                  url: a.url,
                  type: a.type,
                  size: a.size,
                  mimeType: a.mimeType,
                }))
              : undefined,
        },
      },
      {
        onSuccess: () => {
          setIsEditing(false);
          setContent("");
          setAttachments([]);
        },
      },
    );
  };

  const handleUnsubmit = () => {
    unsubmit({ classroomId, postId });
  };

  const handleRemoveAttachment = async (id: string) => {
    // Check if it's an existing submission attachment
    const isExisting = submission?.attachments?.some((a) => a.id === id);

    if (isExisting && submission?.status === "assigned") {
      await removeSubmissionAttachment({
        classroomId,
        postId,
        attachmentId: id,
      });
    } else {
      // It's a new upload, remove from post service (temp upload)
      // Note: This matches logic in AttachmentUpload but we need to call it here
      await postService.removeAttachment(classroomId, id);
    }
  };

  const hasWork = content.trim() || attachments.length > 0;
  const canSubmit = hasWork && !isSubmitting;
  const isSubmitted = !!submission && submission.status !== "assigned";
  const canUnsubmit =
    isSubmitted &&
    (submission.status === "turned_in" || submission.status === "returned");

  return (
    <WorkCardShell status={submission?.status}>
      {isSubmitted ? (
        <>
          {submission.content && (
            <FieldBlock label="Your response">
              <MutedText>{submission.content}</MutedText>
            </FieldBlock>
          )}

          {submission.attachments && submission.attachments.length > 0 && (
            <FieldBlock label="Attachments">
              <AttachmentDisplay
                attachments={submission.attachments}
                variant="compact"
              />
            </FieldBlock>
          )}

          {submission.status === "graded" && submission.grade !== undefined && (
            <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <span className="text-sm font-medium">Grade</span>
              <span className="text-lg font-semibold text-purple-700 dark:text-purple-400">
                {submission.grade}
                {assignmentData?.points && ` / ${assignmentData.points}`}
              </span>
            </div>
          )}

          {submission.feedback && (
            <FieldBlock label="Feedback">
              <MutedText>{submission.feedback}</MutedText>
            </FieldBlock>
          )}

          <p className="text-xs text-muted-foreground">
            Submitted on {format(new Date(submission.createdAt), "PPp")}
          </p>

          {canUnsubmit && (
            <ActionButton
              variant="outline"
              className="w-full"
              onClick={handleUnsubmit}
              pending={isUnsubmitting}
              pendingLabel="Unsubmitting..."
            >
              Unsubmit
            </ActionButton>
          )}
        </>
      ) : isEditing ? (
        <>
          {allowsText && (
            <Field>
              <FieldLabel htmlFor="student-work-response">
                Your response
              </FieldLabel>
              <Textarea
                id="student-work-response"
                placeholder="Type your response here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[100px]"
              />
            </Field>
          )}

          {allowsFiles && (
            <div className="space-y-2">
              {attachments.length > 0 || isAddingAttachment ? (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                  <AttachmentUpload
                    attachments={attachments}
                    onAttachmentsChange={setAttachments}
                    onRemove={handleRemoveAttachment}
                    onUpload={async (file, onProgress) => {
                      return uploadFile({
                        classroomId,
                        file,
                        onProgress,
                      });
                    }}
                  />
                </div>
              ) : (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setIsAddingAttachment(true)}
                >
                  <IconPlus />
                  Add Work
                </Button>
              )}
            </div>
          )}

          <div className="flex gap-2">
            <ActionButton
              className="w-full"
              onClick={handleSubmit}
              disabled={!canSubmit}
              pending={isSubmitting}
              pendingLabel="Submitting..."
            >
              <IconCheck className="mr-2 h-4 w-4" />
              Turn in
            </ActionButton>
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-muted-foreground/20 rounded-lg bg-muted/5 text-muted-foreground text-sm transition-colors hover:bg-muted/10">
            <IconFilePlus className="mb-3 opacity-40" stroke={1.5} size={40} />
            <span>No work attached</span>
          </div>

          <Button
            className="w-full h-10"
            variant="outline"
            onClick={() => {
              setIsEditing(true);
              setIsAddingAttachment(true);
            }}
          >
            <IconPlus size={18} />
            Add or create
          </Button>

          <Button
            className="w-full h-10"
            variant="default"
            onClick={() => setIsEditing(true)}
          >
            Mark as done
          </Button>
        </>
      )}
    </WorkCardShell>
  );
}
