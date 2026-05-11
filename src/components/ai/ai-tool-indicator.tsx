'use client';

import { Wrench } from 'lucide-react';
import { motion } from 'motion/react';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface AiToolIndicatorProps {
  tools: string[];
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
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 3 }}
          key={tool}
          transition={{ duration: 0.14 }}
        >
          <Badge className="gap-1.5" variant="secondary">
            <Wrench className="size-3" />
            {tool}
          </Badge>
        </motion.div>
      ))}
    </div>
  );
}
