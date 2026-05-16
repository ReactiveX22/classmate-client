"use client";

import { useState } from "react";

interface ExpandableContentProps {
  content: string;
  maxLines?: number;
  className?: string;
}

export function ExpandableContent({
  content,
  className = "",
}: ExpandableContentProps) {
  const [isExpanded, setIsExpanded] = useState(false);

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
        onClick={() => setIsExpanded(!isExpanded)}
        className="text-xs text-primary hover:underline mt-1 font-medium"
        type="button"
      >
        {isExpanded ? "Show less" : "Read more"}
      </button>
    </div>
  );
}
