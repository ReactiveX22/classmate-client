import { IconSchool } from "@tabler/icons-react";

export default function Logo() {
  return (
    <div className="relative flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-primary via-primary to-primary/75 text-primary-foreground shadow-[0_6px_14px_-6px_color-mix(in_oklab,var(--primary)_55%,transparent)]">
      <IconSchool className="relative z-10 size-[18px]" strokeWidth={1.75} />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/25 to-transparent"
      />
    </div>
  );
}