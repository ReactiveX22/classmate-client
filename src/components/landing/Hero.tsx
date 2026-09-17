"use client";

import { Button } from "@/components/ui/button";
import { IconArrowRight, IconBrandGithub } from "@tabler/icons-react";
import { motion } from "motion/react";
import Link from "next/link";
import { DashboardMockup } from "./DashboardMockup";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      <div className="absolute inset-0 hero-grid opacity-60" />
      <div className="absolute inset-0 hero-radial" />

      <div className="relative max-w-7xl mx-auto px-6 w-full py-12">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          <div className="max-w-xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-sm inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 mb-4"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-medium text-primary tracking-wide">
                Open Source & Free
              </span>
            </motion.div>

            <motion.h1
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-[1.1] tracking-tight text-foreground mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Manage your campus,{" "}
              <span className="text-gradient">without the chaos.</span>
            </motion.h1>

            <motion.p
              className="text-lg text-muted-foreground leading-relaxed mb-10 max-w-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Classrooms, notices, assignments, and attendance - built for
              admins, teachers, and students who are tired of juggling five
              different tools.
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-4 mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Button
                size="lg"
                nativeButton={false}
                className="h-13 px-8 rounded-xl text-base shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all group"
                render={
                  <Link href="/signup">
                    Get Started
                    <IconArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                }
              />
              <Button
                variant="outline"
                size="lg"
                nativeButton={false}
                className="h-13 px-8 rounded-xl text-base hover:-translate-y-0.5 transition-all group border-border/60 hover:border-primary/30"
                render={
                  <Link
                    href="https://github.com/ReactiveX22/classmate-client"
                    target="_blank"
                    rel="noopener"
                  >
                    <IconBrandGithub className="mr-2 h-5 w-5" />
                    View on GitHub
                  </Link>
                }
              />
            </motion.div>
          </div>

          <div className="hidden lg:block">
            <DashboardMockup />
          </div>
        </div>
      </div>
    </section>
  );
}
