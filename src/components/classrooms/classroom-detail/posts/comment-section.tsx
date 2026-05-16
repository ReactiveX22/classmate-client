"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  IconMessage,
  IconSend,
  IconDotsVertical,
  IconEdit,
  IconTrash,
} from "@tabler/icons-react";
import { formatDistanceToNow } from "date-fns";
import { getInitials } from "@/lib/utils";
import { useUser } from "@/hooks/useAuth";
import {
  useComments,
  useCreateComment,
  useDeleteComment,
  useUpdateComment,
} from "@/hooks/use-comments";

interface CommentSectionProps {
  postId: string;
  classroomId: string;
}

export function CommentSection({ postId, classroomId }: CommentSectionProps) {
  const [newComment, setNewComment] = useState("");
  const user = useUser();
  const [isExpanded, setIsExpanded] = useState(true);
  const [showAllComments, setShowAllComments] = useState(false);

  // Edit state
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");

  const { data: comments = [], isLoading: isLoadingComments } = useComments(
    classroomId,
    postId,
  );
  const createComment = useCreateComment();
  const deleteComment = useDeleteComment();
  const updateComment = useUpdateComment();

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!newComment.trim() || !user.data || !classroomId) return;
    createComment.mutate(
      { classroomId, postId, data: { content: newComment.trim() } },
      { onSuccess: () => setNewComment("") },
    );
  };

  const handleDelete = (commentId: string) => {
    if (!classroomId) return;
    deleteComment.mutate({ classroomId, postId, commentId });
  };

  const handleEditSubmit = (commentId: string) => {
    if (!editContent.trim() || !classroomId) return;
    updateComment.mutate(
      { classroomId, postId, commentId, data: { content: editContent.trim() } },
      {
        onSuccess: () => {
          setEditingCommentId(null);
          setEditContent("");
        },
      },
    );
  };

  const startEditing = (comment: any) => {
    setEditingCommentId(comment.id);
    setEditContent(comment.content);
  };

  const cancelEditing = () => {
    setEditingCommentId(null);
    setEditContent("");
  };

  const getCommentAuthorName = (comment: any) => {
    if (comment.author?.name) return comment.author.name;
    if (comment.authorName) return comment.authorName;
    return "Unknown User";
  };

  const getCommentAuthorImage = (comment: any) => {
    if (comment.author?.image) return comment.author.image;
    if (comment.authorImage) return comment.authorImage;
    return undefined;
  };

  if (!classroomId) return null;

  return (
    <div className="mt-3">
      {/* Toggle */}
      <Button
        variant="ghost"
        size="sm"
        className="text-muted-foreground gap-2 h-8 text-xs px-0 hover:bg-transparent hover:text-foreground"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <IconMessage size={15} />
        {comments.length > 0
          ? `${comments.length} ${comments.length === 1 ? "comment" : "comments"}`
          : "Add a comment"}
      </Button>

      {isExpanded && (
        <div className="mt-1 space-y-0.5">
          {isLoadingComments && (
            <p className="text-xs text-muted-foreground py-2 px-1">
              Loading comments...
            </p>
          )}

          {/* Comments List – flat, borderless, Google Classroom style */}
          {!isLoadingComments && comments.length > 0 && (
            <div className="space-y-0.5">
              {(showAllComments ? comments : comments.slice(0, 2)).map(
                (comment: any) => (
                  <div
                    key={comment.id}
                    className="group flex gap-2.5 items-start rounded-xl py-1 hover:bg-muted/40 transition-colors"
                  >
                    <Avatar className="w-6 h-6 shrink-0 mt-0.5">
                      <AvatarImage src={getCommentAuthorImage(comment)} />
                      <AvatarFallback className="text-[10px]">
                        {getInitials(getCommentAuthorName(comment))}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      {editingCommentId === comment.id ? (
                        <div className="space-y-1.5 w-full">
                          <Textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleEditSubmit(comment.id);
                              }
                              if (e.key === "Escape") cancelEditing();
                            }}
                            className="resize-none min-h-[52px] text-sm bg-muted/30 rounded-xl border-0 focus-visible:ring-1"
                            rows={2}
                            disabled={updateComment.isPending}
                            autoFocus
                          />
                          <div className="flex justify-end gap-1.5">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 text-xs"
                              onClick={cancelEditing}
                              disabled={updateComment.isPending}
                            >
                              Cancel
                            </Button>
                            <Button
                              size="sm"
                              className="h-7 text-xs"
                              onClick={() => handleEditSubmit(comment.id)}
                              disabled={
                                updateComment.isPending || !editContent.trim()
                              }
                            >
                              {updateComment.isPending ? "Saving…" : "Save"}
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <p className="text-xs text-foreground whitespace-pre-wrap leading-relaxed">
                            <span className="font-semibold">
                              {getCommentAuthorName(comment).split(" ")[0]}
                            </span>{" "}
                            {comment.content}
                          </p>
                          <span className="text-[10px] text-muted-foreground mt-0.5 block">
                            {comment.createdAt
                              ? formatDistanceToNow(
                                  new Date(comment.createdAt),
                                  { addSuffix: true },
                                )
                              : ""}
                            {comment.updatedAt &&
                              comment.updatedAt !== comment.createdAt &&
                              " · edited"}
                          </span>
                        </>
                      )}
                    </div>

                    {/* Three-dot menu — only for author, only in view mode */}
                    {user.data?.id === comment.authorId &&
                      editingCommentId !== comment.id && (
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            render={
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground"
                              >
                                <IconDotsVertical size={14} />
                              </Button>
                            }
                          />
                          <DropdownMenuContent align="end" className="w-32">
                            <DropdownMenuItem
                              className="gap-2 text-xs cursor-pointer"
                              onClick={() => startEditing(comment)}
                            >
                              <IconEdit size={13} />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="gap-2 text-xs text-destructive focus:text-destructive cursor-pointer"
                              onClick={() => handleDelete(comment.id)}
                              disabled={deleteComment.isPending}
                            >
                              <IconTrash size={13} />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                  </div>
                ),
              )}

              {comments.length > 2 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground h-7 text-xs font-medium px-0 hover:bg-transparent hover:text-foreground"
                  onClick={() => setShowAllComments(!showAllComments)}
                >
                  {showAllComments
                    ? "Show fewer"
                    : `See ${comments.length - 2} more comment${comments.length - 2 !== 1 ? "s" : ""}`}
                </Button>
              )}
            </div>
          )}

          {/* Add Comment – inline input + icon send */}
          {user.data && (
            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-2 mt-2"
            >
              <Avatar className="w-6 h-6 shrink-0">
                <AvatarImage src={user.data.image} />
                <AvatarFallback className="text-[10px]">
                  {getInitials(user.data.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 relative flex items-center">
                <Input
                  placeholder="Add a comment…"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit();
                    }
                  }}
                  className="rounded-full bg-muted/40 border-0 focus-visible:ring-1 text-sm h-8 pr-10"
                  disabled={createComment.isPending}
                />
                <Button
                  type="submit"
                  size="icon"
                  variant="ghost"
                  disabled={!newComment.trim() || createComment.isPending}
                  className="absolute right-1 h-6 w-6 text-primary hover:bg-primary/10 shrink-0"
                >
                  <IconSend size={13} />
                </Button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
