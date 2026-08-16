import { Plus } from "lucide-react";
import Link from "next/link";

export function ClassmateAiAction() {
  return (
    <Link
      href="/dashboard/ai"
      aria-label="New chat"
      title="New chat"
      className="text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 inline-flex size-6 shrink-0 items-center justify-center rounded-md outline-hidden transition-colors"
    >
      <Plus className="size-4" />
    </Link>
  );
}