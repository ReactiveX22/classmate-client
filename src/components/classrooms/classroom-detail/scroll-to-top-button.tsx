"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { IconChevronUp } from "@tabler/icons-react";
import { useCallback, useEffect, useState } from "react";

interface ScrollToTopButtonProps {
  className?: string;
  threshold?: number;
}

export function ScrollToTopButton({
  className,
  threshold = 300,
}: ScrollToTopButtonProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > threshold);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <Button
      variant="outline"
      size="sm"
      className={cn(
        "fixed z-50 h-10 w-10 bg-muted! rounded-full shadow-sm transition-all duration-150 ease-out",
        "bottom-4 right-4 sm:bottom-6 sm:right-6 md:right-80",
        isVisible
          ? "translate-y-0 scale-100 opacity-100"
          : "pointer-events-none translate-y-4 scale-95 opacity-0",
        className,
      )}
      onClick={scrollToTop}
    >
      <IconChevronUp className="h-5 w-5" />
    </Button>
  );
}
