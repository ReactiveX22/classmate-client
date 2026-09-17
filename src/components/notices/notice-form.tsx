"use client";

import { AttachmentUpload } from "@/components/common/attachment-upload";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { RichTextEditor, Link } from "@/components/editor";
import { useNoticeUploadAttachment } from "@/hooks/use-notice-upload-attachment";
import { UploadResult } from "@/hooks/use-upload-attachment";
import { Notice, noticeService } from "@/lib/api/services/notice.service";
import { useForm } from "@tanstack/react-form";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import { CharacterCount } from "@tiptap/extension-character-count";
import { Plus, X } from "lucide-react";
import { useState } from "react";
import { z } from "zod";

const noticeSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  tags: z.array(z.string()),
});

export type NoticeFormValues = z.infer<typeof noticeSchema> & {
  attachments?: UploadResult[];
};

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}

interface NoticeEditorProps {
  value: string;
  onChange: (value: string) => void;
}

function NoticeEditor({ value, onChange }: NoticeEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    shouldRerenderOnTransaction: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4] },
      }),
      Link,
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({ placeholder: "What do you want to share?" }),
      CharacterCount,
    ],
    content: value || "",
    onUpdate: ({ editor: ed }) => {
      onChange(ed.getHTML());
    },
  });

  return (
    <RichTextEditor editor={editor}>
      <RichTextEditor.Toolbar>
        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Bold />
          <RichTextEditor.Italic />
          <RichTextEditor.Underline />
          <RichTextEditor.Strikethrough />
          <RichTextEditor.Code />
          <RichTextEditor.ClearFormatting />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.H1 />
          <RichTextEditor.H2 />
          <RichTextEditor.H3 />
          <RichTextEditor.H4 />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.BulletList />
          <RichTextEditor.OrderedList />
          <RichTextEditor.Blockquote />
          <RichTextEditor.Hr />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.AlignLeft />
          <RichTextEditor.AlignCenter />
          <RichTextEditor.AlignRight />
          <RichTextEditor.AlignJustify />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Link />
          <RichTextEditor.Unlink />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Undo />
          <RichTextEditor.Redo />
        </RichTextEditor.ControlsGroup>
      </RichTextEditor.Toolbar>

      <RichTextEditor.Content />
    </RichTextEditor>
  );
}

interface NoticeFormProps {
  initialData?: Notice;
  onSubmit: (values: NoticeFormValues) => void;
  isSubmitting?: boolean;
  submitLabel?: string;
}

export function NoticeForm({
  initialData,
  onSubmit,
  isSubmitting,
  submitLabel = "Save",
}: NoticeFormProps) {
  const [currentTag, setCurrentTag] = useState("");
  const [attachments, setAttachments] = useState<UploadResult[]>(
    initialData?.attachments?.map((att) => ({
      id: att.id,
      name: att.name,
      url: att.url,
      type: att.type.startsWith("image/")
        ? "image"
        : att.type.startsWith("video/")
          ? "video"
          : "file",
      size: att.size,
      mimeType: att.mimeType || att.type,
    })) || [],
  );

  const { mutateAsync: uploadFile } = useNoticeUploadAttachment();

  const form = useForm({
    defaultValues: {
      title: initialData?.title || "",
      content: initialData?.content || "",
      tags: initialData?.tags || [],
    },
    validators: {
      onChange: noticeSchema.refine(
        (data) => stripHtml(data.content).length > 0,
        { message: "Content is required", path: ["content"] },
      ),
    },
    onSubmit: async ({ value }) => {
      onSubmit({ ...value, attachments });
    },
  });

  const handleAddTag = (
    pushValue: (val: string) => void,
    currentTags: string[],
  ) => {
    const tag = currentTag.trim();
    if (tag && !currentTags.includes(tag)) {
      pushValue(tag);
      setCurrentTag("");
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent,
    pushValue: (val: string) => void,
    currentTags: string[],
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag(pushValue, currentTags);
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="flex flex-col gap-6"
    >
      <FieldGroup>
        <form.Field name="title">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched &&
              field.state.meta.errors.length > 0;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Title *</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Enter notice title"
                  aria-invalid={isInvalid}
                />
                {isInvalid && (
                  <FieldError errors={field.state.meta.errors} />
                )}
              </Field>
            );
          }}
        </form.Field>
      </FieldGroup>

      <FieldGroup>
        <form.Field name="content">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched &&
              field.state.meta.errors.length > 0;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel>Content *</FieldLabel>
                <div
                  className="rounded-lg border border-input overflow-hidden"
                  aria-invalid={isInvalid}
                >
                  <NoticeEditor
                    value={field.state.value || ""}
                    onChange={(val) => field.handleChange(val)}
                  />
                </div>
                {isInvalid && (
                  <FieldError errors={field.state.meta.errors} />
                )}
              </Field>
            );
          }}
        </form.Field>
      </FieldGroup>

      <FieldGroup>
        <form.Field name="tags" mode="array">
          {(field) => {
            return (
              <Field>
                <FieldLabel htmlFor="tag-input">Tags</FieldLabel>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      id="tag-input"
                      placeholder="Add a tag and press Enter"
                      value={currentTag}
                      onChange={(e) => setCurrentTag(e.target.value)}
                      onKeyDown={(e) =>
                        handleKeyDown(e, field.pushValue, field.state.value)
                      }
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        handleAddTag(field.pushValue, field.state.value)
                      }
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {field.state.value.map((tag, index) => (
                      <Badge
                        key={`${tag}-${index}`}
                        variant="secondary"
                        className="gap-1 pl-2.5"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => field.removeValue(index)}
                          className="ml-1 rounded-full p-0.5 hover:bg-muted-foreground/20"
                        >
                          <X className="h-3 w-3" />
                          <span className="sr-only">Remove {tag} tag</span>
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Categorize your notice with tags (e.g., urgent, announcement).
                </p>
              </Field>
            );
          }}
        </form.Field>
      </FieldGroup>

      <FieldGroup>
        <AttachmentUpload
          attachments={attachments}
          onAttachmentsChange={setAttachments}
          onUpload={async (file, onProgress) => {
            return uploadFile({ file, onProgress });
          }}
          onRemove={async (id) => {
            await noticeService.removeAttachment(id);
          }}
        />
      </FieldGroup>

      <div className="flex justify-end pt-2">
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
        >
          {([canSubmit]) => (
            <Button type="submit" disabled={!canSubmit || isSubmitting}>
              {isSubmitting ? "Saving..." : submitLabel}
            </Button>
          )}
        </form.Subscribe>
      </div>
    </form>
  );
}
