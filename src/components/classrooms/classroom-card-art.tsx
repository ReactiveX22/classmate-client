import { Badge } from "@/components/ui/badge";

export interface ClassroomPattern {
  bg: string;
  shape: string;
  shapeSoft: string;
  badge: string;
}

export const colorPatterns: ClassroomPattern[] = [
  {
    bg: "bg-indigo-100 dark:bg-indigo-500/15",
    shape: "bg-indigo-300/80 dark:bg-indigo-400/25",
    shapeSoft: "bg-indigo-200/70 dark:bg-indigo-400/15",
    badge: "bg-white/70 text-indigo-800 dark:bg-white/10 dark:text-indigo-200",
  },
  {
    bg: "bg-amber-100 dark:bg-amber-500/15",
    shape: "bg-amber-300/80 dark:bg-amber-400/25",
    shapeSoft: "bg-amber-200/70 dark:bg-amber-400/15",
    badge: "bg-white/70 text-amber-800 dark:bg-white/10 dark:text-amber-200",
  },
  {
    bg: "bg-sky-100 dark:bg-sky-500/15",
    shape: "bg-sky-300/80 dark:bg-sky-400/25",
    shapeSoft: "bg-sky-200/70 dark:bg-sky-400/15",
    badge: "bg-white/70 text-sky-800 dark:bg-white/10 dark:text-sky-200",
  },
  {
    bg: "bg-rose-100 dark:bg-rose-500/15",
    shape: "bg-rose-300/80 dark:bg-rose-400/25",
    shapeSoft: "bg-rose-200/70 dark:bg-rose-400/15",
    badge: "bg-white/70 text-rose-800 dark:bg-white/10 dark:text-rose-200",
  },
  {
    bg: "bg-emerald-100 dark:bg-emerald-500/15",
    shape: "bg-emerald-300/80 dark:bg-emerald-400/25",
    shapeSoft: "bg-emerald-200/70 dark:bg-emerald-400/15",
    badge: "bg-white/70 text-emerald-800 dark:bg-white/10 dark:text-emerald-200",
  },
  {
    bg: "bg-violet-100 dark:bg-violet-500/15",
    shape: "bg-violet-300/80 dark:bg-violet-400/25",
    shapeSoft: "bg-violet-200/70 dark:bg-violet-400/15",
    badge: "bg-white/70 text-violet-800 dark:bg-white/10 dark:text-violet-200",
  },
];

export function ClassroomCardArt({
  pattern,
  code,
}: {
  pattern: ClassroomPattern;
  code: string;
}) {
  return (
    <div className={`relative h-20 overflow-hidden ${pattern.bg}`}>
      <div className="absolute inset-0" aria-hidden="true">
        <span
          className={`absolute -right-10 -bottom-14 size-28 rounded-full ${pattern.shape}`}
        />
        <span
          className={`absolute right-20 -bottom-8 size-14 rounded-full ${pattern.shapeSoft}`}
        />
        <span className="absolute right-36 bottom-1 size-5 rounded-full bg-white/60 dark:bg-white/10" />
        <span className="absolute right-28 top-4 size-2.5 rounded-full bg-white/60 dark:bg-white/10" />
      </div>
      <Badge
        className={`absolute top-3 right-3 border-none font-medium ${pattern.badge}`}
      >
        {code}
      </Badge>
    </div>
  );
}