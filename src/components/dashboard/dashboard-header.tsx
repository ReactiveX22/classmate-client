"use client";

import { Pencil } from "lucide-react";
import { useParams, usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { RenameConversationDialog } from "@/components/ai/rename-conversation-dialog";
import { ModeToggle } from "@/components/mode-toggle";
import { RoleBadge } from "@/components/dashboard/role-badge";
import { useTaskSheet } from "@/components/task-sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAiConversation } from "@/hooks/use-ai-conversation";
import { useRenameConversation } from "@/hooks/use-rename-conversation";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { IconListCheck } from "@tabler/icons-react";

type DashboardHeaderProps = React.HTMLAttributes<HTMLElement> & {
  fixed?: boolean;
  ref?: React.Ref<HTMLElement>;
};

export function DashboardHeader({
  className,
  fixed = true,
  children,
  ...props
}: DashboardHeaderProps) {
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const skipBlur = useRef(false);
  const pathname = usePathname();
  const params = useParams();
  const convId = params?.convId as string | undefined;
  const isAiChat = Boolean(pathname?.startsWith("/dashboard/ai/") && convId);
  const { toggle: toggleTaskSheet } = useTaskSheet();
  const isMobile = useIsMobile();
  const rename = useRenameConversation();

  const conversationQuery = useAiConversation(convId ?? "");
  const rawTitle = isAiChat
    ? (conversationQuery.data?.conversation?.title ?? null)
    : null;
  const chatTitle = rawTitle?.trim() ? rawTitle : null;
  const displayTitle = chatTitle ?? "Untitled chat";
  const isLoadingTitle = isAiChat && conversationQuery.isLoading;

  useEffect(() => {
    setIsEditing(false);
    setIsRenameOpen(false);
  }, [convId]);

  const startEditing = () => {
    if (!convId) return;
    if (isMobile) {
      setIsRenameOpen(true);
      return;
    }
    setDraft(chatTitle ?? "");
    setIsEditing(true);
  };

  const commitEdit = () => {
    if (!convId) {
      setIsEditing(false);
      return;
    }
    const trimmed = draft.trim();
    if (trimmed && trimmed !== chatTitle) {
      rename.mutate({ id: convId, title: trimmed });
    }
    setIsEditing(false);
  };

  const cancelEdit = () => {
    skipBlur.current = true;
    setDraft(chatTitle ?? "");
    setIsEditing(false);
  };

  return (
    <>
      <header
        className={cn(
          "grid h-14 shrink-0 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-1.5 border-b border-border/80 bg-background/85 px-4 backdrop-blur-md",
          fixed && "sticky top-0 z-50",
          className,
        )}
        {...props}
      >
        <div className="flex min-w-0 items-center gap-1.5">
          <SidebarTrigger />
        </div>
        <div className="flex w-full min-w-0 max-w-[min(300px,40vw)] justify-center justify-self-center">
          {isAiChat ? (
            isLoadingTitle ? (
              <Skeleton
                className="h-5 w-40"
                aria-label="Loading conversation title"
              />
            ) : isEditing && convId ? (
              <Input
                autoFocus
                value={draft}
                disabled={rename.isPending}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") commitEdit();
                  if (e.key === "Escape") cancelEdit();
                }}
                onBlur={() => {
                  if (skipBlur.current) {
                    skipBlur.current = false;
                    return;
                  }
                  commitEdit();
                }}
                aria-label="Conversation title"
                placeholder="Untitled chat"
                className="h-8 border-primary/50 text-center text-base font-medium focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            ) : (
              <h1 className="min-w-0 max-w-full text-base font-medium text-foreground">
                <button
                  type="button"
                  onClick={startEditing}
                  aria-label={`Rename conversation ${displayTitle}`}
                  className="group flex w-full min-w-0 items-center justify-center gap-2 rounded-md px-2 py-1 outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                >
                  <span
                    className={cn(
                      "truncate",
                      !chatTitle && "text-muted-foreground",
                    )}
                  >
                    {displayTitle}
                  </span>
                  <Pencil
                    size={14}
                    aria-hidden
                    className="shrink-0 text-muted-foreground opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100 md:group-focus-visible:opacity-100"
                  />
                </button>
              </h1>
            )
          ) : null}
        </div>
        <div className="flex items-center gap-1.5 justify-self-end">
          <RoleBadge />
          {!isAiChat && (
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={toggleTaskSheet}
                  >
                    <IconListCheck className="size-4" />
                  </Button>
                }
              />
              <TooltipContent>
                <KbdGroup>
                  <Kbd>Ctrl</Kbd>
                  <Kbd>K</Kbd>
                </KbdGroup>
              </TooltipContent>
            </Tooltip>
          )}
          <ModeToggle />
          {children}
        </div>
      </header>
      {convId && (
        <RenameConversationDialog
          open={isRenameOpen}
          onOpenChange={setIsRenameOpen}
          conversationId={convId}
          currentTitle={chatTitle ?? ""}
        />
      )}
    </>
  );
}
