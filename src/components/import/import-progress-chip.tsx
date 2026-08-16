"use client";

import { Button } from "@/components/ui/button";
import { IconChartBar } from "@tabler/icons-react";
import { motion } from "motion/react";

interface ImportProgressChipProps {
  fileName: string;
  progress: number;
  onOpen: () => void;
}

export function ImportProgressChip({
  fileName,
  progress,
  onOpen,
}: ImportProgressChipProps) {
  return (
    <Button
      variant="outline"
      onClick={onOpen}
      className="h-9 gap-2 rounded-full px-3"
    >
      <motion.span
        className="flex items-center"
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
      >
        <IconChartBar size={15} className="text-primary" />
      </motion.span>
      <span className="max-w-32 truncate text-xs font-medium">{fileName}</span>
      <span className="text-xs tabular-nums text-muted-foreground">
        {progress}%
      </span>
    </Button>
  );
}
