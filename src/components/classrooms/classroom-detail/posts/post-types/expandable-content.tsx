"use client";

import { useState } from "react";

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

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextState = !isExpanded;
    setIsExpanded(nextState);
    onToggle?.(nextState);
  };

  return (
    <div>
      <div
        className={`text-sm whitespace-pre-wrap leading-relaxed ${className} ${
          !isExpanded ? "line-clamp-6" : ""
        }`}
      >
        {content}
      </div>
      <button
        onClick={handleToggle}
        className="text-xs text-primary hover:underline mt-1 font-medium cursor-pointer"
        type="button"
      >
        {isExpanded ? "Show less" : "Read more"}
      </button>
    </div>
  );
}
