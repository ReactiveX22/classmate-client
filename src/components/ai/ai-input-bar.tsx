"use client";

import { ArrowUp, Square } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  PromptInput,
  PromptInputAction,
  PromptInputTextarea,
} from "@/components/ui/chat/prompt-input";

interface AiInputBarProps {
  isStreaming: boolean;
  isRetrying?: boolean;
  onSend: (message: string) => void | Promise<void>;
  onStop: () => void;
}

export function AiInputBar({
  isStreaming,
  isRetrying,
  onSend,
  onStop,
}: AiInputBarProps) {
  const [message, setMessage] = useState("");

  const canSend = message.trim().length > 0 && !isStreaming && !isRetrying;

  const handleSubmit = async () => {
    if (!canSend) {
      return;
    }

    const nextMessage = message.trim();
    setMessage("");
    await onSend(nextMessage);
  };

  return (
    <>
      <PromptInput
        className="border-input bg-popover relative z-10 w-full border shadow-xs rounded-[28px]"
        isLoading={isStreaming}
        onSubmit={handleSubmit}
        value={message}
        onValueChange={setMessage}
      >
        <div className="relative">
          <PromptInputTextarea
            autoFocus
            className="rounded-[28px] p-4 pr-10 pl-5 md:text-base text-primary-foreground"
            disabled={isStreaming || isRetrying}
            placeholder="Ask anything"
          />

          <div className="absolute bottom-[12px] right-2">
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
          </div>
        </div>
      </PromptInput>

      <p className="text-muted-foreground mt-2 text-center text-xs">
        AI-generated content may not be accurate.
      </p>
    </>
  );
}
