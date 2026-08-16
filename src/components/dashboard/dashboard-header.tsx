"use client";

import { useQueryClient } from "@tanstack/react-query";
import { Pencil } from "lucide-react";
import { useParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { RenameConversationDialog } from "@/components/ai/rename-conversation-dialog";
import { ModeToggle } from "@/components/mode-toggle";
import { RoleBadge } from "@/components/dashboard/role-badge";
import { useTaskSheet } from "@/components/task-sheet";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const params = useParams();
  const convId = params?.convId as string | undefined;
  const isAiChat = pathname?.startsWith("/dashboard/ai/") && convId;
  const { toggle: toggleTaskSheet } = useTaskSheet();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const queryClient = useQueryClient();
  const conversations = queryClient.getQueryData<{
    conversations: { id: string; title: string | null }[];
  }>(["ai", "conversations"]);

  const chatTitle = isAiChat
    ? conversations?.conversations?.find((c) => c.id === convId)?.title
    : null;

  return (
    <>
      <header
        className={cn(
          "relative flex h-14 shrink-0 items-center gap-1.5 border-b border-border/80 bg-background/85 px-4 backdrop-blur-md transition-[background-color,box-shadow]",
          fixed && "sticky top-0 z-50",
          isScrolled && "bg-background/95 shadow-[0_1px_3px_rgba(0,0,0,0.05)]",
          className,
        )}
        {...props}
      >
        <SidebarTrigger />
        {chatTitle && convId ? (
          <button
            type="button"
            onClick={() => setIsRenameOpen(true)}
            className="group absolute left-1/2 flex max-w-[300px] -translate-x-1/2 cursor-pointer items-center gap-2 text-base font-medium text-foreground focus:outline-none"
          >
            <span className="truncate">{chatTitle}</span>
            <Pencil
              size={14}
              className="shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
            />
          </button>
        ) : null}
        <div className="ml-auto flex items-center gap-1.5">
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
      {chatTitle && convId && (
        <RenameConversationDialog
          open={isRenameOpen}
          onOpenChange={setIsRenameOpen}
          conversationId={convId}
          currentTitle={chatTitle}
        />
      )}
    </>
  );
}