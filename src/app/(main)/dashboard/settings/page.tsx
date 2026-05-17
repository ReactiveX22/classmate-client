"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

import { DeleteConfirmDialog } from "@/components/common/delete-confirm-dialog";
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
    <div className="container mx-auto py-8 px-8 max-w-7xl">
      <div className="space-y-0.5 mb-8">
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-8">
        <Tabs
          defaultValue="security"
          className="min-w-full"
          orientation="vertical"
        >
          <div className="flex flex-col sm:flex-row gap-8">
            <div className="flex-1">
              <TabsContent value="profile" className="mt-0">
                {/* Profile settings would go here */}
              </TabsContent>

              <TabsContent
                value="security"
                className="mt-0 grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <ChangePasswordForm />

                <Card className="h-fit">
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
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </div>

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
