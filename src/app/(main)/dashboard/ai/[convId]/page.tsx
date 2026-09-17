"use client";

import { AiChatPage } from "@/components/ai/ai-chat-page";
import { useAiAutoMessage } from "@/contexts/ai-auto-message-context";
import { use, useEffect } from "react";

interface AiConversationPageProps {
  params: Promise<{ convId: string }>;
}

export default function AiConversationPage({
  params,
}: AiConversationPageProps) {
  const { convId } = use(params);
  const { pendingMessage, setPendingMessage } = useAiAutoMessage();

  useEffect(() => {
    if (pendingMessage) {
      setPendingMessage(null);
    }
    // Intentional one-shot on conversation change: adding pendingMessage
    // to deps would clear freshly-set messages on arrival.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [convId]);

  return <AiChatPage convId={convId} autoMessage={pendingMessage} />;
}
