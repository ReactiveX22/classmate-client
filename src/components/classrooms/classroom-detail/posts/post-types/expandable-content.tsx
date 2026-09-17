"use client";

import { cn } from "@/lib/utils";
import { useLayoutEffect, useRef, useState } from "react";
import { PostContent } from "../post-content";

interface ExpandableContentProps {
  content: string;
  maxLines?: number;
  className?: string;
  onToggle?: (isExpanded: boolean) => void;
}

export function ExpandableContent({
  content,
  className = "",
  onToggle,
}: ExpandableContentProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // line-clamp can't clamp nested block HTML, so measure real overflow
  // while collapsed and only then offer the toggle.
  useLayoutEffect(() => {
    if (isExpanded) return;
    const el = contentRef.current;
    if (!el) return;
    const check = () => setIsOverflowing(el.scrollHeight > el.clientHeight + 4);
    check();
    const raf = requestAnimationFrame(check);
    window.addEventListener("resize", check);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", check);
    };
  }, [content, isExpanded]);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextState = !isExpanded;
    setIsExpanded(nextState);
    onToggle?.(nextState);
  };

  return (
    <div>
      <div className="relative">
        <div
          ref={contentRef}
          className={cn(
            "text-sm leading-relaxed",
            className,
            !isExpanded && "max-h-36 overflow-hidden",
          )}
        >
          <PostContent content={content} />
        </div>
        {!isExpanded && isOverflowing && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-card to-transparent"
          />
        )}
      </div>
      {isOverflowing && (
        <button
          onClick={handleToggle}
          className="text-xs text-primary hover:underline mt-1 font-medium cursor-pointer"
          type="button"
        >
          {isExpanded ? "Show less" : "Read more"}
        </button>
      )}
    </div>
  );
}
