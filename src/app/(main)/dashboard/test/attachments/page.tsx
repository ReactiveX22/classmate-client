"use client";

import { AttachmentDisplay } from "@/components/classrooms/classroom-detail/posts/post-types/attachment-display";
import { Attachment } from "@/lib/api/services/post.service";
import { useState } from "react";

const mockAttachments: Attachment[] = [
  // Link
  {
    id: "1",
    name: "Google Drive Folder",
    url: "https://drive.google.com/folder",
    type: "link",
    size: 0,
  },
  // Image
  {
    id: "2",
    name: "lecture-slide-1.png",
    url: "/placeholder.png",
    type: "image",
    mimeType: "image/png",
    size: 2456789,
  },
  // Video
  {
    id: "3",
    name: "tutorial-recording.mp4",
    url: "/video.mp4",
    type: "video",
    mimeType: "video/mp4",
    size: 52428800,
  },
  // PDF
  {
    id: "4",
    name: "syabus-2024.pdf",
    url: "/file.pdf",
    type: "file",
    mimeType: "application/pdf",
    size: 1048576,
  },
  // Word
  {
    id: "5",
    name: "essay-template.docx",
    url: "/file.docx",
    type: "file",
    mimeType:
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    size: 524288,
  },
  // Excel
  {
    id: "6",
    name: "grade-sheet.xlsx",
    url: "/file.xlsx",
    type: "file",
    mimeType:
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    size: 262144,
  },
  // PowerPoint
  {
    id: "7",
    name: "chapter-5-review.pptx",
    url: "/file.pptx",
    type: "file",
    mimeType:
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    size: 3145728,
  },
  // ZIP
  {
    id: "8",
    name: "project-assets.zip",
    url: "/file.zip",
    type: "file",
    mimeType: "application/zip",
    size: 10485760,
  },
  // Text
  {
    id: "9",
    name: "readme.txt",
    url: "/file.txt",
    type: "file",
    mimeType: "text/plain",
    size: 4096,
  },
  // Generic fallback
  {
    id: "10",
    name: "unknown-format.xyz",
    url: "/file.xyz",
    type: "file",
    mimeType: "application/octet-stream",
    size: 8192,
  },
];

export default function AttachmentPreviewPage() {
  const [variant, setVariant] = useState<"default" | "compact">("default");

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-3xl space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Attachment Display Preview</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setVariant("default")}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                variant === "default"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80"
              }`}
            >
              Default
            </button>
            <button
              onClick={() => setVariant("compact")}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                variant === "compact"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80"
              }`}
            >
              Compact
            </button>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <AttachmentDisplay attachments={mockAttachments} variant={variant} />
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold">Only Links & Files</h2>
          <AttachmentDisplay
            attachments={mockAttachments.filter(
              (a) => a.type === "link" || a.type === "file",
            )}
            variant={variant}
          />
        </div>
      </div>
    </div>
  );
}
