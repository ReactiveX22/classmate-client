"use client";

import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";

interface AiErrorBannerProps {
  message?: string;
  onRetry: () => void;
}

export function AiErrorBanner({ message, onRetry }: AiErrorBannerProps) {
  return (
    <Alert variant="destructive" className="mx-auto w-full max-w-2xl">
      <AlertCircle className="size-4" />
      <AlertTitle>AI response failed</AlertTitle>
      <AlertDescription>
        {message ??
          "The AI was unable to generate a response. You can retry to try again."}
      </AlertDescription>
      <AlertAction>
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5"
          onClick={onRetry}
        >
          <RefreshCw className="size-3.5" />
          Retry
        </Button>
      </AlertAction>
    </Alert>
  );
}
