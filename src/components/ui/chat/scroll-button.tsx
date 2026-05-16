"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { type VariantProps } from "class-variance-authority";
import { ChevronDown } from "lucide-react";

export type ScrollButtonProps = {
  className?: string;
  variant?: VariantProps<typeof buttonVariants>["variant"];
  size?: VariantProps<typeof buttonVariants>["size"];
  isNearBottom?: boolean;
  onScrollToBottom?: () => void;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

function ScrollButton({
  className,
  variant = "outline",
  size = "sm",
  isNearBottom = true,
  onScrollToBottom,
  ...props
}: ScrollButtonProps) {
  return (
    <Button
      variant={variant}
      size={size}
      className={cn(
        "h-10 w-10 bg-muted! rounded-full transition-all duration-150 ease-out",
        isNearBottom
          ? "pointer-events-none translate-y-4 scale-95 opacity-0"
          : "translate-y-0 scale-100 opacity-100",
        className,
      )}
      onClick={onScrollToBottom}
      {...props}
    >
      <ChevronDown className="h-5 w-5" />
    </Button>
  );
}

export { ScrollButton };
