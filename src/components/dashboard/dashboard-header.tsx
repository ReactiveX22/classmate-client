"use client";

import { Pencil } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { RenameConversationDialog } from "@/components/ai/rename-conversation-dialog";
import { ModeToggle } from "@/components/mode-toggle";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

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
  const { data: chatTitle } = useQuery({
    queryKey: ["ai", "activeChatTitle"],
    queryFn: () => null,
    initialData: null,
  });
  const { data: chatId } = useQuery({
    queryKey: ["ai", "activeChatId"],
    queryFn: () => null,
    initialData: null,
  });

  return (
    <>
      <header
        className={cn(
          "shrink-0 flex h-14 items-center gap-2 bg-background px-4 mt-2 rounded-md",
          fixed && "sticky top-0 z-50",
          className,
        )}
        {...props}
      >
        <SidebarTrigger className="-ml-1" />
        {chatTitle && chatId ? (
          <button
            type="button"
            onClick={() => setIsRenameOpen(true)}
            className="group absolute left-1/2 -translate-x-1/2 flex items-center gap-2 text-sm text-foreground max-w-[300px] focus:outline-none"
          >
            <span className="truncate">{chatTitle}</span>
            <Pencil
              size={14}
              className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
            />
          </button>
        ) : null}
        <div className="flex items-center gap-2 ml-auto">
          <ModeToggle />
          {children}
        </div>
      </header>
      {chatTitle && chatId && (
        <RenameConversationDialog
          open={isRenameOpen}
          onOpenChange={setIsRenameOpen}
          conversationId={chatId}
          currentTitle={chatTitle}
        />
      )}
    </>
  );
}
