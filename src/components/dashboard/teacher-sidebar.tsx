"use client";

import { RenameConversationDialog } from "@/components/ai/rename-conversation-dialog";
import { DeleteConfirmDialog } from "@/components/common/delete-confirm-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sidebar } from "@/components/ui/sidebar";
import { useAiConversationsForClassrooms } from "@/hooks/use-ai-conversations-for-classrooms";
import { useClassrooms } from "@/hooks/use-classrooms";
import { useDeleteConversation } from "@/hooks/use-delete-conversation";
import { SidebarData } from "@/types/sidebar-types";
import {
  BookOpenIcon,
  LayoutDashboard,
  Megaphone,
  MoreHorizontal,
  Pencil,
  Plus,
  Settings,
  Trash2,
  User,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { AppSidebar } from "./app-sidebar";

function ConversationAction({
  conversationId,
  currentTitle,
}: {
  conversationId: string;
  currentTitle: string;
}) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);

  const deleteConversation = useDeleteConversation();

  const handleDelete = async () => {
    await deleteConversation.mutateAsync(conversationId);
    setIsDeleteDialogOpen(false);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          onClick={(e) => {
            e.preventDefault();
          }}
          render={
            <button className="p-2 cursor-pointer">
              <MoreHorizontal className="size-4" />
            </button>
          }
          className="opacity-0 transition-opacity group-hover/item:flex group-hover/item:opacity-100 data-popup-open:opacity-100 focus:outline-none"
        ></DropdownMenuTrigger>
        <DropdownMenuContent side="right" align="start">
          <DropdownMenuItem
            onClick={(e) => {
              e.preventDefault();
              setIsRenameDialogOpen(true);
            }}
          >
            <Pencil className="mr-2 size-4" />
            Rename
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onClick={(e) => {
              e.preventDefault();
              setIsDeleteDialogOpen(true);
            }}
          >
            <Trash2 className="mr-2 size-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDelete}
        isLoading={deleteConversation.isPending}
      />

      <RenameConversationDialog
        open={isRenameDialogOpen}
        onOpenChange={setIsRenameDialogOpen}
        conversationId={conversationId}
        currentTitle={currentTitle}
      />
    </>
  );
}

export function TeacherSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { data: classroomsResponse, isLoading } = useClassrooms({
    limit: 50,
  });
  const classroomIds =
    classroomsResponse?.data?.map((item) => item.classroom.id) ?? [];
  const { conversations, isLoading: isConversationsLoading } =
    useAiConversationsForClassrooms(classroomIds);

  const teacherDashboardData: SidebarData = useMemo(() => {
    const classroomItems =
      classroomsResponse?.data?.map((item) => ({
        title: item.classroom.name,
        url: `/dashboard/classrooms/${item.classroom.id}`,
      })) || [];

    const conversationItems = conversations.map((conversation) => ({
      title: conversation.title || "Untitled chat",
      url: `/dashboard/ai/${conversation.id}`,
      action: (
        <ConversationAction
          conversationId={conversation.id}
          currentTitle={conversation.title || "Untitled chat"}
        />
      ),
    }));

    const conversationsNavItems =
      conversationItems.length > 0
        ? conversationItems
        : [
            {
              title: isConversationsLoading ? "Loading..." : "No chats yet",
              url: "/dashboard/ai",
            },
          ];

    const myClassesItems = [
      {
        title: "All Classes",
        url: "/dashboard/classrooms",
      },
      ...classroomItems,
    ];

    return {
      user: {
        name: "Teacher Name",
        email: "teacher@example.com",
        image: "",
      },
      navGroups: [
        {
          title: "General",
          items: [
            {
              title: "Dashboard",
              url: "/dashboard",
              icon: LayoutDashboard,
            },
            {
              title: "My Classes",
              icon: BookOpenIcon,
              items:
                classroomItems.length > 0
                  ? myClassesItems
                  : [
                      {
                        title: isLoading ? "Loading..." : "No classes yet",
                        url: "/dashboard/classrooms",
                      },
                    ],
            },
            {
              title: "Notices",
              url: "/dashboard/notices",
              icon: Megaphone,
            },
          ],
        },
        {
          title: "ClassMate AI",
          action: (
            <Link
              className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground inline-flex size-7 items-center justify-center rounded-md transition-colors"
              href="/dashboard/ai"
              aria-label="New chat"
              title="New chat"
            >
              <Plus className="size-4" />
            </Link>
          ),
          items: conversationsNavItems,
        },
        {
          title: "Account",
          items: [
            {
              title: "Profile",
              url: "/dashboard/profile",
              icon: User,
            },
            {
              title: "Settings",
              url: "/dashboard/settings",
              icon: Settings,
            },
          ],
        },
      ],
    };
  }, [classroomsResponse, conversations, isLoading, isConversationsLoading]);

  return <AppSidebar data={teacherDashboardData} {...props} />;
}
