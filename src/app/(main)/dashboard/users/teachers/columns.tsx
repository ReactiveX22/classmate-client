"use client";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { DeleteTeacherDialog } from "@/components/teachers/delete-teacher-dialog";
import { EditTeacherDialog } from "@/components/teachers/edit-teacher-dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useImpersonate } from "@/hooks/useAuth";
import { TeacherData } from "@/lib/api/services/teacher.service";
import { IconEdit, IconEye, IconTrash, IconUserShare } from "@tabler/icons-react";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

export const teacherColumns: ColumnDef<TeacherData>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        indeterminate={
          table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected()
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-0.5"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-0.5"
      />
    ),
    enableSorting: false,
    enableHiding: false,
    size: 40,
  },
  {
    accessorKey: "user.name",
    id: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Name" />
    ),
    meta: {
      label: "Name",
      placeholder: "Filter by name...",
      variant: "text",
    },
    cell: ({ row }) => {
      const teacher = row.original;
      return (
        <Link
          href={`/dashboard/users/${teacher.user.id}`}
          className="font-medium hover:underline underline-offset-4 decoration-primary/30"
        >
          {teacher.user.name}
        </Link>
      );
    },
  },
  {
    accessorKey: "user.email",
    id: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Email" />
    ),
    meta: {
      label: "Email",
      placeholder: "Filter by email...",
      variant: "text",
    },
    cell: ({ row }) => {
      const email = row.original.user.email;
      return <div className="truncate">{email}</div>;
    },
  },
  {
    accessorKey: "user_profile.phone",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Phone" />
    ),
    meta: {
      label: "Phone",
      placeholder: "Filter by phone...",
      variant: "text",
    },
    cell: ({ row }) => {
      const phone = row.original.userProfile?.phone;
      return <div className="truncate">{phone || "-"}</div>;
    },
  },
  {
    accessorKey: "teacher.title",
    id: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Title" />
    ),
    meta: {
      label: "Title",
      placeholder: "Filter by title...",
      variant: "text",
    },
    cell: ({ row }) => {
      const title = row.original.teacher.title;

      return <div>{title}</div>;
    },
  },

  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Joined" />
    ),
    meta: {
      label: "Joined",
      variant: "date",
    },
    cell: ({ row }) => {
      const dateValue =
        row.original.teacher?.joinDate || row.original.user.createdAt;

      if (!dateValue) return <span className="text-muted-foreground">-</span>;

      const date = new Date(dateValue);

      return (
        <span className="font-medium">{format(date, "MMM dd, yyyy")}</span>
      );
    },
    enableSorting: true,
  },

  {
    id: "actions",
    cell: ({ row }) => <ActionCell teacher={row.original} />,
    size: 40,
  },
];

const ActionCell = ({ teacher }: { teacher: TeacherData }) => {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { mutate: impersonate, isPending: isImpersonating } = useImpersonate();

  const handleImpersonate = () => {
    const loadingId = toast.loading(`Logging in as ${teacher.user.name}...`);
    impersonate(teacher.user.id, {
      onSuccess: () => {
        toast.success("Logged in successfully", { id: loadingId });
      },
      onError: (error) => {
        toast.error(error.message || "Failed to log in", {
          id: loadingId,
        });
      },
    });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
            >
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          }
        ></DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuItem
            render={<Link href={`/dashboard/users/${teacher.user.id}`} />}
          >
            <IconEye /> View Details
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
            <IconEdit /> Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleImpersonate}
            disabled={isImpersonating}
          >
            <IconUserShare /> Login As
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            onClick={() => setShowDeleteDialog(true)}
          >
            <IconTrash />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EditTeacherDialog
        teacher={teacher}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
      />

      <DeleteTeacherDialog
        teacher={teacher}
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
      />
    </>
  );
};
