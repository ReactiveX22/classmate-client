import { NotFoundActions } from "@/components/illustrations/not-found-actions";
import { Storyset404Art } from "@/components/illustrations/storyset-404-art";
import Header from "@/components/landing/Header";
import { Badge } from "@/components/ui/badge";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page not found • ClassMate",
  description:
    "This page doesn't exist, was moved, or the link broke. Get back to class.",
};

export default function NotFound() {
  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden bg-background text-foreground">
      {/* Ambient background wash */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 left-1/2 h-56 w-[36rem] -translate-x-1/2 rounded-full bg-primary/[0.07] blur-3xl" />
        <div className="absolute -right-24 -bottom-24 h-56 w-56 rounded-full bg-primary/[0.05] blur-3xl" />
      </div>

      {/* The real landing header, so the 404 matches the site pixel for pixel —
          with the section nav switched off (those anchors live on the homepage).
          Its anchor links are absolute (/#features) so they work from here too. */}
      <Header showNav={false} />

      <main className="relative z-10 mx-auto flex w-full max-w-xl flex-1 -translate-y-2 flex-col items-center justify-center gap-5 px-6 pt-24 pb-8 text-center md:-translate-y-4 md:pt-28">
        <Storyset404Art />

        <Badge variant="secondary">404 · Lost on campus</Badge>

        <div className="flex flex-col items-center gap-2.5">
          <h1 className="text-3xl font-bold tracking-tight text-balance md:text-4xl">
            This lecture hall is empty.
          </h1>
          <p className="max-w-md text-[15px] leading-relaxed text-pretty text-muted-foreground">
            This page doesn&apos;t exist, was moved, or the link broke.
          </p>
        </div>

        <NotFoundActions />
      </main>
    </div>
  );
}
