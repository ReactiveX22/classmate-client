"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { IconMessage, IconSend, IconTrash, IconEdit } from "@tabler/icons-react";
import { formatDistanceToNow } from "date-fns";
import { getInitials } from "@/lib/utils";
import { useUser } from "@/hooks/useAuth";
import { useComments, useCreateComment, useDeleteComment, useUpdateComment } from "@/hooks/use-comments";

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

  // Use the API hook instead of localStorage
  const { data: comments = [], isLoading: isLoadingComments } = useComments(classroomId, postId);
  const createComment = useCreateComment();
  const deleteComment = useDeleteComment();
  const updateComment = useUpdateComment();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newComment.trim() || !user.data || !classroomId) return;

    createComment.mutate(
      {
        classroomId,
        postId,
        data: { content: newComment.trim() },
      },
      {
        onSuccess: () => {
          setNewComment("");
        },
      }
    );
  };

  const handleDelete = (commentId: string) => {
    if (!classroomId) return;
    deleteComment.mutate({
      classroomId,
      postId,
      commentId,
    });
  };

  const handleEditSubmit = (commentId: string) => {
    if (!editContent.trim() || !classroomId) return;

    updateComment.mutate(
      {
        classroomId,
        postId,
        commentId,
        data: { content: editContent.trim() },
      },
      {
        onSuccess: () => {
          setEditingCommentId(null);
          setEditContent("");
        },
      }
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

  // Helper to extract name safely
  const getCommentAuthorName = (comment: any) => {
    if (comment.author?.name) return comment.author.name;
    if (comment.authorName) return comment.authorName;
    return "Unknown User";
  };

  // Helper to extract image safely
  const getCommentAuthorImage = (comment: any) => {
    if (comment.author?.image) return comment.author.image;
    if (comment.authorImage) return comment.authorImage;
    return undefined;
  };

  // Safeguard against missing classroomId which would break the API calls
  if (!classroomId) {
    return null;
  }

  return (
    <div className="mt-2 border-t pt-2">
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
        <div className="mt-1 space-y-2">
          {isLoadingComments && (
            <div className="text-center text-sm text-muted-foreground py-2">
              Loading comments...
            </div>
          )}

          {/* Existing Comments */}
          {!isLoadingComments && comments.length > 0 && (
            <div>
              {(showAllComments ? comments : comments.slice(0, 2)).map((comment: any) => (
                <Card key={comment.id} className="mb-2">
                  <CardContent className="px-2 md:px-3">
                    <div className="flex gap-3">
                      <Avatar className="w-5 h-5 shrink-0">
                        <AvatarImage src={getCommentAuthorImage(comment)} />
                        <AvatarFallback>
                          {getInitials(getCommentAuthorName(comment))}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium">
                            {getCommentAuthorName(comment).split(' ')[0]}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {comment.createdAt ? formatDistanceToNow(new Date(comment.createdAt), {
                              addSuffix: true,
                            }) : ""}
                            {comment.updatedAt && comment.updatedAt !== comment.createdAt && " (edited)"}
                          </span>
                        </div>

                        {/* Edit Mode vs View Mode */}
                        {editingCommentId === comment.id ? (
                          <div className="space-y-2 mt-2 w-full pr-2">
                            <Textarea
                              value={editContent}
                              onChange={(e) => setEditContent(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                  e.preventDefault();
                                  handleEditSubmit(comment.id);
                                }
                              }}
                              className="resize-none min-h-[60px] bg-background"
                              rows={2}
                              disabled={updateComment.isPending}
                            />
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={cancelEditing}
                                disabled={updateComment.isPending}
                              >
                                Cancel
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handleEditSubmit(comment.id)}
                                disabled={updateComment.isPending || !editContent.trim()}
                              >
                                {updateComment.isPending ? "Saving..." : "Save"}
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <p className="text-sm text-foreground whitespace-pre-wrap">
                            {comment.content}
                          </p>
                        )}
                      </div>

                      {/* Actions - only show if user is author and not currently editing */}
                      {user.data?.id === comment.authorId && editingCommentId !== comment.id && (
                        <div className="flex items-start -mt-1 -mr-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 shrink-0 text-muted-foreground hover:text-foreground"
                            onClick={() => startEditing(comment)}
                            disabled={deleteComment.isPending}
                          >
                            <IconEdit size={14} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 shrink-0 text-muted-foreground hover:text-destructive"
                            onClick={() => handleDelete(comment.id)}
                            disabled={deleteComment.isPending}
                          >
                            <IconTrash size={14} />
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Show more/less comments button */}
              {comments.length > 2 && (
                <div className="pt-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground px-2 h-8 text-xs font-medium"
                    onClick={() => setShowAllComments(!showAllComments)}
                  >
                    {showAllComments ? "Show fewer comments" : `See ${comments.length - 2} more comments`}
                  </Button>
                </div>
              )}
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
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit(e as any);
                      }
                    }}
                    className="resize-none min-h-[40px]"
                    rows={2}
                    disabled={createComment.isPending}
                  />
                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      size="sm"
                      disabled={!newComment.trim() || createComment.isPending}
                      className="gap-2"
                    >
                      <IconSend size={14} />
                      {createComment.isPending ? "Posting..." : "Comment"}
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
