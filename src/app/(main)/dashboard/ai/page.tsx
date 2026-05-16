"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { AiInputBar } from "@/components/ai/ai-input-bar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAiAutoMessage } from "@/contexts/ai-auto-message-context";
import { useUser } from "@/hooks/useAuth";
import { aiService } from "@/lib/api/services/ai.service";
import { Role } from "@/types/auth";
import { IconSparkles } from "@tabler/icons-react";

export default function AiDashboardPage() {
  const router = useRouter();
  const { setPendingMessage } = useAiAutoMessage();
  const { data: user } = useUser();
  const [isCreating, setIsCreating] = useState(false);

  const handleSend = async (message: string) => {
    if (isCreating) return;

    setIsCreating(true);

    try {
      const result = await aiService.createNewChat({});
      setPendingMessage(message);
      router.push(`/dashboard/ai/${result.conversationId}`);
    } catch {
      toast.error("Failed to start chat", {
        description: "Please try again.",
      });
      setIsCreating(false);
    }
  };

  return (
    <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden bg-background">
      <div className="flex min-h-[40vh] flex-col items-center justify-center px-4 text-center">
        <Card className="max-w-2xl border-none bg-transparent shadow-none ring-0">
          <CardHeader className="flex flex-col items-center gap-4 pb-2">
            <Avatar size="lg" className="size-16">
              <AvatarFallback className="bg-primary text-primary-foreground">
                <IconSparkles className="size-8" />
              </AvatarFallback>
            </Avatar>
            <CardTitle className="text-2xl">Hi, I am ClassMate AI</CardTitle>
          </CardHeader>
          <CardContent className="text-center text-muted-foreground">
            {user?.role === Role.Instructor
              ? "I'm here to help you create courses, manage classes, grade assignments, and support your teaching workflow."
              : "I'm here to help you with your studies, answer questions, explain concepts, and assist you with any learning needs."}
          </CardContent>
        </Card>
      </div>

      <div className="pointer-events-none absolute left-1/2 bottom-5 z-10 w-full max-w-200 -translate-x-1/2 px-3 md:px-5">
        <div className="pointer-events-auto">
          <AiInputBar
            isStreaming={isCreating}
            onSend={handleSend}
            onStop={() => {}}
          />
        </div>
      </div>
    </div>
  );
}
