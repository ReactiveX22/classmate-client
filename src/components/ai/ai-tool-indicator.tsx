'use client';

import { Wrench } from 'lucide-react';
import { motion } from 'motion/react';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface AiToolIndicatorProps {
  tools: { name: string; status: "running" | "finishing" }[];
  className?: string;
}

export function AiToolIndicator({ tools, className }: AiToolIndicatorProps) {
  if (tools.length === 0) {
    return null;
  }

  return (
    <div className={cn('flex flex-wrap items-center gap-1.5', className)}>
      {tools.map((tool) => (
        <motion.div
          animate={{
            opacity: 1,
            y: 0,
            scale: tool.status === "finishing" ? 0.98 : 1,
          }}
          exit={{ opacity: 0, y: -4 }}
          initial={{ opacity: 0, y: 4 }}
          key={tool.name}
          layout
          transition={{ duration: 0.18, ease: "easeOut" }}
        >
          <Badge
            className="gap-1.5 transition-colors duration-200"
            variant={tool.status === "finishing" ? "outline" : "secondary"}
          >
            <Wrench className="size-3" />
            {tool.name}
          </Badge>
        </motion.div>
      ))}
    </div>
  );
}
