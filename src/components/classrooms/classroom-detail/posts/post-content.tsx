"use client";

import { StaticRenderer } from "@/components/static-renderer";
import { Markdown } from "@/components/ui/chat/markdown";
import { isPostHtml } from "./post-content-editor";

interface PostContentProps {
  content: string;
}

/**
 * Renders editor HTML for new posts via StaticRenderer (own
 * `rte-static-renderer` styles), legacy markdown/plain text via Markdown.
 */
export function PostContent({ content }: PostContentProps) {
  if (isPostHtml(content)) {
    return <StaticRenderer content={content} />;
  }
  return <Markdown className="chat-markdown">{content}</Markdown>;
}
