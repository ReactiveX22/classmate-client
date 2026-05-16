"use client";

import { Button } from "@/components/ui/button";
import { IconArrowRight } from "@tabler/icons-react";
import Link from "next/link";

export function CTA() {
  return (
    <section
      id="contact"
      className="py-24 md:py-32 px-4 sm:px-6 relative overflow-hidden"
    >
      {/* Glow effect behind button */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-3xl mx-auto text-center space-y-8 relative z-10">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-balance leading-tight">
          Ready to modernize your campus?
        </h2>
        <p className="text-lg sm:text-xl text-muted-foreground text-balance max-w-xl mx-auto">
          Join hundreds of educators and thousands of students already using
          ClassMate to streamline their academic life.
        </p>
        <div className="pt-4">
          <Button
            size="lg"
            nativeButton={false}
            render={<Link href="/signup" />}
            className="h-14 px-10 text-base rounded-full shadow-2xl shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-0.5 transition-all group glowing-button"
          >
            Get Started for Free
            <IconArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    </section>
  );
}
