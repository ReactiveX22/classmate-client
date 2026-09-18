"use client";

import { ArrowUp, Square } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  PromptInput,
  PromptInputAction,
  PromptInputActions,
  PromptInputTextarea,
} from "@/components/ui/chat/prompt-input";
import { IconWorld } from "@tabler/icons-react";

interface AiInputBarProps {
  isStreaming: boolean;
  isRetrying?: boolean;
  onSend: (
    message: string,
    options?: { webSearch?: boolean },
  ) => void | Promise<void>;
  onStop: () => void;
}

export function AiInputBar({
  isStreaming,
  isRetrying,
  onSend,
  onStop,
}: AiInputBarProps) {
  const [message, setMessage] = useState("");
  const [webSearch, setWebSearch] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("ai-web-search") === "true";
  });

  useEffect(() => {
    localStorage.setItem("ai-web-search", String(webSearch));
  }, [webSearch]);

  const canSend = message.trim().length > 0 && !isStreaming && !isRetrying;

  const handleSubmit = async () => {
    if (!canSend) {
      return;
    }

    const nextMessage = message.trim();
    setMessage("");
    await onSend(nextMessage, { webSearch });
  };

  return (
    <>
      <PromptInput
        className="border-input bg-popover relative z-10 w-full border shadow-md rounded-[28px]"
        isLoading={isStreaming}
        onSubmit={handleSubmit}
        value={message}
        onValueChange={setMessage}
      >
        <PromptInputTextarea
          autoFocus
          className="rounded-[28px] p-4 pr-10 md:text-base"
          disabled={isStreaming || isRetrying}
          placeholder="Ask anything"
        />

        <PromptInputActions className="px-3 pb-3">
          <PromptInputAction
            tooltip={webSearch ? "Web search on" : "Web search off"}
          >
            <Button
              className="gap-1.5 rounded-full px-2.5"
              disabled={isStreaming || isRetrying}
              onClick={() => setWebSearch((prev) => !prev)}
              size="sm"
              type="button"
              variant={webSearch ? "secondary" : "ghost"}
            >
              <IconWorld
                size={14}
                className={webSearch ? "text-primary" : "text-muted-foreground"}
              />
              <span className={`text-sm ${webSearch ? "text-primary" : "text-muted-foreground"}`}>
                Web Search
              </span>
            </Button>
          </PromptInputAction>

          <div className="flex-1" />

          <PromptInputAction
            tooltip={isStreaming ? "Stop generation" : "Send message"}
          >
            <Button
              className="size-8 rounded-full"
              disabled={!canSend && !isStreaming}
              onClick={isStreaming ? onStop : handleSubmit}
              size="icon"
              type="button"
            >
              {isStreaming ? <Square size={16} /> : <ArrowUp size={16} />}
            </Button>
          </PromptInputAction>
        </PromptInputActions>
      </PromptInput>

      <p className="text-muted-foreground mt-2 text-center text-xs">
        AI-generated content may not be accurate.
      </p>
    </>
  );
}
