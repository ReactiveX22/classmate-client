"use client";

import { motion } from "motion/react";
import {
  IconLayoutDashboard,
  IconBook,
  IconSpeakerphone,
  IconSettings,
  IconUsers,
  IconShieldCheck,
  IconBell,
  IconCalendarEvent,
} from "@tabler/icons-react";
import { GraduationCap } from "lucide-react";

export function DashboardMockup() {
  return (
    <motion.div
      className="relative w-full"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
    >
      <div
        className="relative rounded-2xl overflow-hidden border border-border/6 shadow-2xl shadow-black/30"
        style={{
          transform: "rotateY(-5deg) rotateX(2deg)",
          transformStyle: "preserve-3d",
          transition: "transform 0.6s ease",
        }}
      >
        <div className="absolute inset-0 bg-linear-to-tr from-primary/5 via-transparent to-chart-2/5 pointer-events-none z-10" />

        {/* Title bar */}
        <div className="flex items-center gap-2 px-3 py-2 bg-card border-b border-border/40">
          <div className="flex gap-1">
            <div className="w-2 h-2 rounded-full bg-red-400/70" />
            <div className="w-2 h-2 rounded-full bg-yellow-400/70" />
            <div className="w-2 h-2 rounded-full bg-green-400/70" />
          </div>
          <div className="flex-1 flex justify-center">
            <div className="flex items-center gap-2 px-4 py-1 rounded-lg bg-muted/50 text-xs text-muted-foreground">
              <IconShieldCheck size={10} />
              classmate - dashboard
            </div>
          </div>
        </div>

        {/* App Content */}
        <div className="bg-background flex min-h-[420px]">
          {/* Mini sidebar */}
          <div className="w-10 shrink-0 flex flex-col items-center gap-2 py-3 border-r border-border/30 bg-card/50">
            <div className="w-7 h-7 rounded-lg bg-primary/15 flex items-center justify-center">
              <IconLayoutDashboard size={13} className="text-primary" />
            </div>
            <div className="w-7 h-7 rounded-lg hover:bg-muted flex items-center justify-center transition-colors">
              <IconBook size={13} className="text-muted-foreground" />
            </div>
            <div className="w-7 h-7 rounded-lg hover:bg-muted flex items-center justify-center transition-colors">
              <IconSpeakerphone size={13} className="text-muted-foreground" />
            </div>
            <div className="w-7 h-7 rounded-lg hover:bg-muted flex items-center justify-center transition-colors">
              <IconUsers size={13} className="text-muted-foreground" />
            </div>
            <div className="mt-auto w-7 h-7 rounded-lg hover:bg-muted flex items-center justify-center transition-colors">
              <IconSettings size={13} className="text-muted-foreground" />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-4 overflow-hidden">
            {/* Welcome header */}
            <div className="mb-4">
              <p className="text-sm font-semibold">Welcome, Sarah Jenkins</p>
              <p className="text-[10px] text-muted-foreground">
                Thursday, September 17, 2026
              </p>
            </div>

            {/* 3-column layout: 2 cols classes+notices, 1 col upcoming */}
            <div className="grid grid-cols-3 gap-3">
              {/* Left: Classes + Notices */}
              <div className="col-span-2 space-y-3">
                {/* Your Classes */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <div className="p-1 rounded-lg bg-primary/10">
                        <GraduationCap
                          size={10}
                          className="text-primary"
                        />
                      </div>
                      <span className="text-[10px] font-semibold">
                        Your Classes
                      </span>
                    </div>
                    <span className="text-[9px] text-primary">View All</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      {
                        name: "Data Structures",
                        code: "CS301",
                        section: "A",
                        students: 42,
                        pattern: "bg-indigo-100 dark:bg-indigo-500/15",
                        shape: "bg-indigo-300/80 dark:bg-indigo-400/25",
                      },
                      {
                        name: "Algorithms",
                        code: "CS401",
                        section: "B",
                        students: 35,
                        pattern: "bg-amber-100 dark:bg-amber-500/15",
                        shape: "bg-amber-300/80 dark:bg-amber-400/25",
                      },
                    ].map((c) => (
                      <div
                        key={c.code}
                        className="rounded-xl border border-border/30 overflow-hidden bg-card hover:shadow-md transition-shadow"
                      >
                        {/* Card art */}
                        <div
                          className={`relative h-10 overflow-hidden ${c.pattern}`}
                        >
                          <span
                            className={`absolute -right-4 -bottom-6 size-12 rounded-full ${c.shape}`}
                          />
                          <span className="absolute top-1.5 right-2 text-[8px] font-medium px-1.5 py-0.5 rounded bg-white/70 dark:bg-white/10 text-[color:var(--foreground)]">
                            {c.code}
                          </span>
                        </div>
                        <div className="p-2.5">
                          <p className="text-[11px] font-semibold line-clamp-1">
                            {c.name}
                          </p>
                          <p className="text-[9px] text-muted-foreground mt-0.5">
                            Section {c.section} · 3 Credits
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-1">
                              <div className="w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center text-[7px] font-bold text-primary">
                                D
                              </div>
                              <span className="text-[9px] text-muted-foreground">
                                Instructor
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <IconUsers size={8} />
                              <span className="text-[9px]">{c.students}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Latest Notices */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <div className="p-1 rounded-lg bg-primary/10">
                        <IconBell size={10} className="text-primary" />
                      </div>
                      <span className="text-[10px] font-semibold">
                        Latest Notices
                      </span>
                    </div>
                    <span className="text-[9px] text-primary">View All</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      {
                        title: "Final Exam Schedule Released",
                        author: "Admin · Sep 17",
                      },
                      {
                        title: "Campus Seminar: Future of AI",
                        author: "CS Dept · Sep 16",
                      },
                    ].map((n) => (
                      <div
                        key={n.title}
                        className="p-2.5 rounded-xl border border-border/20 bg-card hover:bg-muted/50 transition-colors"
                      >
                        <p className="text-[10px] font-medium line-clamp-1">
                          {n.title}
                        </p>
                        <p className="text-[9px] text-muted-foreground mt-1">
                          {n.author}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right: Upcoming */}
              <div className="col-span-1">
                <div className="flex items-center gap-1.5 mb-2">
                  <div className="p-1 rounded-lg bg-primary/10">
                    <IconCalendarEvent size={10} className="text-primary" />
                  </div>
                  <span className="text-[10px] font-semibold">Upcoming</span>
                </div>
                <div className="space-y-1">
                  {[
                    {
                      title: "Assignment 3",
                      classroom: "CS301 · 2:30 PM",
                      date: "Today",
                      color: "bg-indigo-500",
                      today: true,
                    },
                    {
                      title: "Quiz 2",
                      classroom: "CS401 · 10:00 AM",
                      date: "Tomorrow",
                      color: "bg-amber-500",
                      today: false,
                    },
                    {
                      title: "Project Proposal",
                      classroom: "CS301 · 11:59 PM",
                      date: "Sep 22",
                      color: "bg-indigo-500",
                      today: false,
                    },
                  ].map((item) => (
                    <div
                      key={item.title}
                      className="group p-2 rounded-lg hover:bg-muted/50 transition-all border-l-2 border-transparent hover:border-primary"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`size-1.5 rounded-full ${item.color} shrink-0`}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] font-semibold line-clamp-1">
                            {item.title}
                          </p>
                          <p className="text-[8px] text-muted-foreground">
                            {item.classroom}
                          </p>
                        </div>
                        <span
                          className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full whitespace-nowrap ${
                            item.today
                              ? "bg-rose-50 text-rose-600 border border-rose-100 dark:bg-rose-500/10 dark:text-rose-400"
                              : "bg-muted/50 text-muted-foreground"
                          }`}
                        >
                          {item.date}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Notification Card */}
      <div className="absolute -right-6 top-10 animate-float z-20">
        <div className="glass rounded-xl p-3 shadow-xl flex items-center gap-3 w-52">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center shrink-0">
            <IconBell size={14} className="text-emerald-500" />
          </div>
          <div>
            <p className="text-[11px] font-semibold">Notice Published!</p>
            <p className="text-[10px] text-muted-foreground">
              Exam schedule updated
            </p>
          </div>
        </div>
      </div>

      {/* Floating Faculty Card */}
      <div className="absolute -left-8 bottom-12 animate-float-delayed z-20">
        <div className="glass rounded-xl p-3 shadow-xl flex items-center gap-3 w-48">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <IconUsers size={14} className="text-primary" />
          </div>
          <div>
            <p className="text-[11px] font-semibold">3 Submissions</p>
            <p className="text-[10px] text-muted-foreground">
              CS301 - Assignment 3
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
