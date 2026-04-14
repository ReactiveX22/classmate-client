"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { IconMessage, IconSend, IconTrash } from "@tabler/icons-react";
import { formatDistanceToNow } from "date-fns";
import { getInitials } from "@/lib/utils";
import { User } from "@/types/auth";
import { useUser } from "@/hooks/useAuth";

export interface Comment {
  id: string;
  postId: string;
  content: string;
  authorId: string;
  authorName: string;
  authorImage?: string;
  createdAt: string;
}

interface CommentSectionProps {
  postId: string;
}

const STORAGE_KEY = "classmate_comments";

function getComments(postId: string): Comment[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const allComments: Record<string, Comment[]> = JSON.parse(stored);
    return allComments[postId] || [];
  } catch (error) {
    console.error("Error loading comments from localStorage:", error);
    return [];
  }
}

function saveComment(postId: string, comment: Comment) {
  if (typeof window === "undefined") return;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const allComments: Record<string, Comment[]> = stored
      ? JSON.parse(stored)
      : {};

    if (!allComments[postId]) {
      allComments[postId] = [];
    }

    allComments[postId].push(comment);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allComments));
  } catch (error) {
    console.error("Error saving comment to localStorage:", error);
  }
}

function deleteComment(postId: string, commentId: string) {
  if (typeof window === "undefined") return;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return;

    const allComments: Record<string, Comment[]> = JSON.parse(stored);
    if (!allComments[postId]) return;

    allComments[postId] = allComments[postId].filter((c) => c.id !== commentId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allComments));
  } catch (error) {
    console.error("Error deleting comment from localStorage:", error);
  }
}

export function CommentSection({ postId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const user = useUser();
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const loadedComments = getComments(postId);
    setComments(loadedComments);
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newComment.trim() || !user.data) return;

    setIsSubmitting(true);

    const comment: Comment = {
      id: `comment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      postId,
      content: newComment.trim(),
      authorId: user.data.id,
      authorName: user.data.name,
      authorImage: user.data.image,
      createdAt: new Date().toISOString(),
    };

    // Save to localStorage
    saveComment(postId, comment);

    // Update UI
    setComments((prev) => [...prev, comment]);
    setNewComment("");
    setIsSubmitting(false);
  };

  const handleDelete = (commentId: string) => {
    deleteComment(postId, commentId);
    setComments((prev) => prev.filter((c) => c.id !== commentId));
  };

  return (
    <div className="mt-4 border-t pt-4">
      {/* Comment Toggle Button */}
      <Button
        variant="ghost"
        size="sm"
        className="text-muted-foreground gap-2"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <IconMessage size={16} />
        {comments.length > 0
          ? `${comments.length} ${comments.length === 1 ? "comment" : "comments"}`
          : "Add a comment"}
      </Button>

      {/* Comment Section */}
      {isExpanded && (
        <div className="mt-3 space-y-4">
          {/* Existing Comments */}
          {comments.length > 0 && (
            <div className="space-y-0.5">
              {comments.map((comment) => (
                <Card key={comment.id} className="bg-muted/50 py-2 md:py-3">
                  <CardContent className="px-2 md:px-3">
                    <div className="flex gap-3">
                      <Avatar className="w-5 h-5 shrink-0">
                        <AvatarImage src={comment.authorImage} />
                        <AvatarFallback>
                          {getInitials(comment.authorName)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium">
                            {comment.authorName}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(comment.createdAt), {
                              addSuffix: true,
                            })}
                          </span>
                        </div>
                        <p className="text-sm text-foreground whitespace-pre-wrap">
                          {comment.content}
                        </p>
                      </div>
                      {/* Delete button - only show if user is the comment author */}
                      {user.data?.id === comment.authorId && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 shrink-0 text-muted-foreground hover:text-destructive"
                          onClick={() => handleDelete(comment.id)}
                        >
                          <IconTrash size={14} />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Add Comment Form */}
          {user.data && (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="flex gap-3">
                <Avatar className="w-7 h-7 shrink-0 mt-2">
                  <AvatarImage src={user.data.image} />
                  <AvatarFallback>{getInitials(user.data.name)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <Textarea
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="resize-none min-h-[60px]"
                    rows={2}
                  />
                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      size="sm"
                      disabled={!newComment.trim() || isSubmitting}
                      className="gap-2"
                    >
                      <IconSend size={14} />
                      {isSubmitting ? "Posting..." : "Comment"}
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
