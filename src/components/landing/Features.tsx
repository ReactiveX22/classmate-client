"use client";

import { motion } from "motion/react";
import {
  IconChalkboard,
  IconBell,
  IconUsers,
  IconClipboardList,
  IconUserCheck,
  IconLock,
  IconChartBar,
  IconMessage,
  IconFileStack,
} from "@tabler/icons-react";

const features = [
  {
    icon: IconChalkboard,
    title: "Virtual Classrooms",
    description:
      "Create course spaces with assignments, materials, and student enrollment - everything in one place instead of scattered across Google Drive and email.",
    color: "text-primary bg-primary/10 group-hover:bg-primary/15",
  },
  {
    icon: IconBell,
    title: "Campus-Wide Notices",
    description:
      "Post announcements that actually get seen. Urgent alerts, events, and updates reach students and faculty in real time - no more relying on email threads.",
    color: "text-amber-500 bg-amber-500/10 group-hover:bg-amber-500/15",
  },
  {
    icon: IconUsers,
    title: "Faculty & Student Management",
    description:
      "Onboard instructors, enroll students, and assign roles. A clean directory so you always know who teaches what and who's in which class.",
    color: "text-chart-2 bg-chart-2/10 group-hover:bg-chart-2/15",
  },
  {
    icon: IconUserCheck,
    title: "Attendance Tracking",
    description:
      "One-click attendance that gives teachers a quick overview of who showed up and who didn't. No paper sheets, no spreadsheets.",
    color: "text-emerald-500 bg-emerald-500/10 group-hover:bg-emerald-500/15",
  },
  {
    icon: IconClipboardList,
    title: "Assignment & Grading",
    description:
      "Students submit work, teachers grade it inline. Deadlines, submissions, and grades - all visible in one classroom view.",
    color: "text-rose-500 bg-rose-500/10 group-hover:bg-rose-500/15",
  },
  {
    icon: IconChartBar,
    title: "Academic Analytics",
    description:
      "Dashboards for enrollment numbers, course completion rates, and faculty workload. Numbers you can actually use, not just decoration.",
    color: "text-violet-500 bg-violet-500/10 group-hover:bg-violet-500/15",
  },
  {
    icon: IconMessage,
    title: "Real-time Notifications",
    description:
      "Live updates via WebSockets. When a notice goes out or an assignment is posted, everyone sees it immediately.",
    color: "text-blue-500 bg-blue-500/10 group-hover:bg-blue-500/15",
  },
  {
    icon: IconFileStack,
    title: "Resource Sharing",
    description:
      "Upload lecture notes, PDFs, and links directly into a classroom. Students find everything they need without digging through chat history.",
    color: "text-cyan-500 bg-cyan-500/10 group-hover:bg-cyan-500/15",
  },
  {
    icon: IconLock,
    title: "Role-Based Access",
    description:
      "Admins, instructors, and students each see only what they need. No accidentally deleting someone else's course.",
    color: "text-slate-400 bg-slate-500/10 group-hover:bg-slate-500/15",
  },
];

export function Features() {
  return (
    <section id="features" className="relative py-24 md:py-32 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16 md:mb-20">
          <motion.div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-xs font-medium text-primary">
              What ClassMate gives you
            </span>
          </motion.div>
          <motion.h2
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-5"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Built for how campuses{" "}
            <span className="text-gradient">actually work</span>
          </motion.h2>
          <motion.p
            className="text-lg text-muted-foreground leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Not another bloated LMS. ClassMate covers the essentials -
            classrooms, notices, assignments, and attendance - without the
            bloatware.
          </motion.p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="group relative rounded-2xl border border-border/40 bg-card p-7 hover:border-primary/25 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-400 hover:-translate-y-1"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: (index % 3) * 0.1 }}
            >
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(135deg, color-mix(in srgb, var(--primary) 8%, transparent), transparent, color-mix(in srgb, var(--chart-2) 4%, transparent))",
                }}
              />
              <div
                className={`relative mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-300 ${feature.color}`}
              >
                <feature.icon size={22} stroke={1.5} />
              </div>
              <h3 className="relative mb-2.5 text-lg font-bold tracking-tight">
                {feature.title}
              </h3>
              <p className="relative text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
