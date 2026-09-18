"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Settings } from "lucide-react";

import { DeleteConfirmDialog } from "@/components/common/delete-confirm-dialog";
import { PageHeader } from "@/components/common/page-header";
import { RoleGuard } from "@/components/common/role-guard";
import { ChangePasswordForm } from "@/components/settings/change-password-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Role } from "@/types/auth";
import { aiService } from "@/lib/api/services/ai.service";

export default function SettingsPage() {
  const queryClient = useQueryClient();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const deleteAllMutation = useMutation({
    mutationFn: () => aiService.deleteAllConversations(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ai", "conversations"] });
      setDeleteDialogOpen(false);
      toast.success("All conversations deleted");
    },
    onError: () => {
      toast.error("Failed to delete conversations");
    },
  });

  return (
    <div className="flex flex-col gap-6 p-6">
      <PageHeader
        icon={Settings}
        title="Settings"
        description="Manage your account settings and preferences."
      />

      <Tabs defaultValue="security">
        <TabsContent value="profile" />

        <TabsContent value="security">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl items-start">
            <ChangePasswordForm />

            <RoleGuard allowedRoles={[Role.Instructor, Role.Student]}>
              <Card size="sm">
                <CardHeader>
                  <CardTitle>ClassMate AI</CardTitle>
                  <CardDescription>
                    Manage your AI conversations and chat history.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">
                        Delete All Conversations
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Permanently remove all your AI conversations. This
                        action cannot be undone.
                      </p>
                    </div>
                    <Button
                      variant="destructive"
                      onClick={() => setDeleteDialogOpen(true)}
                      disabled={deleteAllMutation.isPending}
                    >
                      Delete
                    </Button>
                  </div>
                </CardContent>
            </Card>
            </RoleGuard>
          </div>
        </TabsContent>
      </Tabs>

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete All Conversations?"
        description="This will permanently delete all your AI conversations and chat history. This action cannot be undone."
        onConfirm={() => deleteAllMutation.mutate()}
        isLoading={deleteAllMutation.isPending}
      />
    </div>
  );
}
