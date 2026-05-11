"use client";

import { useState } from "react";
import { ArrowUp, Ellipsis, Globe, Plus, Square } from "lucide-react";

import {
  PromptInputAction,
  PromptInput,
  PromptInputActions,
  PromptInputTextarea,
} from "@/components/ui/chat/prompt-input";
import { Button } from "@/components/ui/button";

interface AiInputBarProps {
  isStreaming: boolean;
  onSend: (message: string) => void | Promise<void>;
  onStop: () => void;
}

export function AiInputBar({ isStreaming, onSend, onStop }: AiInputBarProps) {
  const [message, setMessage] = useState("");
  const canSend = message.trim().length > 0 && !isStreaming;

  const handleSubmit = async () => {
    if (!canSend) {
      return;
    }

    const nextMessage = message.trim();
    setMessage("");
    await onSend(nextMessage);
  };

  return (
    <PromptInput
      className="border-input bg-popover relative z-10 w-full rounded-3xl border p-0 pt-1 shadow-xs"
      isLoading={isStreaming}
      onSubmit={handleSubmit}
      value={message}
      onValueChange={setMessage}
    >
      <div className="flex flex-col">
        <PromptInputTextarea
          className="min-h-[44px] px-4 pt-3 pl-4 text-base leading-[1.3]"
          disabled={isStreaming}
          placeholder="Ask anything"
        />

        <PromptInputActions className="mt-5 flex w-full items-center justify-between gap-2 px-3 pb-3">
          <div className="flex items-center gap-2">
            <PromptInputAction tooltip="Add a new action">
              <Button variant="outline" size="icon" className="rounded-full">
                <Plus size={18} />
              </Button>
            </PromptInputAction>

            <PromptInputAction tooltip="Search">
              <Button variant="outline" className="rounded-full">
                <Globe size={18} />
                Search
              </Button>
            </PromptInputAction>

            <PromptInputAction tooltip="More actions">
              <Button variant="outline" size="icon" className="rounded-full">
                <Ellipsis size={18} />
              </Button>
            </PromptInputAction>
          </div>

          <PromptInputAction
            tooltip={isStreaming ? "Stop generation" : "Send message"}
          >
            <Button
              className="size-9 rounded-full"
              disabled={!canSend && !isStreaming}
              onClick={isStreaming ? onStop : handleSubmit}
              size="icon"
              type="button"
            >
              {isStreaming ? <Square /> : <ArrowUp />}
            </Button>
          </PromptInputAction>
        </PromptInputActions>
      </div>
    </PromptInput>
  );
}
