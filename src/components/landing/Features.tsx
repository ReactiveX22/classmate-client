'use client';

import { motion } from 'motion/react';
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
} from '@tabler/icons-react';

const features = [
  {
    icon: IconChalkboard,
    title: 'Virtual Classrooms',
    description: 'Create and manage course spaces with assignments, materials, and student streams — all centralized for effortless teaching.',
    color: 'text-primary bg-primary/10 group-hover:bg-primary/15',
  },
  {
    icon: IconBell,
    title: 'Campus-Wide Notices',
    description: 'Broadcast urgent announcements, events, and updates to the entire institution instantly. No more missed emails or outdated boards.',
    color: 'text-amber-500 bg-amber-500/10 group-hover:bg-amber-500/15',
  },
  {
    icon: IconUsers,
    title: 'Faculty & Student Management',
    description: 'Onboard instructors, enroll students, and assign roles with precision. A clear academic hierarchy built for institutions.',
    color: 'text-chart-2 bg-chart-2/10 group-hover:bg-chart-2/15',
  },
  {
    icon: IconUserCheck,
    title: 'Attendance Tracking',
    description: 'Track presence with one click. Automated records give faculty real-time attendance insights with zero administrative overhead.',
    color: 'text-emerald-500 bg-emerald-500/10 group-hover:bg-emerald-500/15',
  },
  {
    icon: IconClipboardList,
    title: 'Assignment & Grading',
    description: 'Seamless submission flow for students and powerful inline grading tools for teachers — from draft to final grade in one place.',
    color: 'text-rose-500 bg-rose-500/10 group-hover:bg-rose-500/15',
  },
  {
    icon: IconChartBar,
    title: 'Academic Analytics',
    description: 'Institutional dashboards track enrollment, course completion, and faculty performance. Make data-driven decisions with confidence.',
    color: 'text-violet-500 bg-violet-500/10 group-hover:bg-violet-500/15',
  },
  {
    icon: IconMessage,
    title: 'Real-time Collaboration',
    description: 'Live notifications, classroom discussions, and instant alerts keep every stakeholder connected and informed across the campus.',
    color: 'text-blue-500 bg-blue-500/10 group-hover:bg-blue-500/15',
  },
  {
    icon: IconFileStack,
    title: 'Resource Sharing',
    description: 'Upload lecture notes, syllabi, and course materials directly into classrooms. Students access everything they need, in one hub.',
    color: 'text-cyan-500 bg-cyan-500/10 group-hover:bg-cyan-500/15',
  },
  {
    icon: IconLock,
    title: 'Role-Based Security',
    description: 'Enterprise-grade access control for Admins, Instructors, and Students. Each role sees exactly what they need — nothing more.',
    color: 'text-slate-400 bg-slate-500/10 group-hover:bg-slate-500/15',
  },
];

export function Features() {
  return (
    <section id='features' className='relative py-24 md:py-32 px-4 sm:px-6'>
      <div className='max-w-7xl mx-auto'>
        {/* Section Header */}
        <div className='text-center max-w-2xl mx-auto mb-16 md:mb-20'>
          <motion.div
            className='inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 mb-6'
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className='text-xs font-medium text-primary'>✦ Feature-Rich Platform</span>
          </motion.div>
          <motion.h2
            className='text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-5'
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Everything you need to{' '}
            <span className='text-gradient'>run your campus</span>
          </motion.h2>
          <motion.p
            className='text-lg text-muted-foreground leading-relaxed'
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Powerful tools designed for every role in the modern university ecosystem — from administration to the last row of the classroom.
          </motion.p>
        </div>

        {/* Features Grid */}
        <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-5'>
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className='group relative rounded-2xl border border-border/40 bg-card p-7 hover:border-primary/25 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-400 hover:-translate-y-1'
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: (index % 3) * 0.1 }}
            >
              {/* Gradient border on hover via pseudo-element trick */}
              <div className='absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none'
                style={{
                  background: 'linear-gradient(135deg, color-mix(in srgb, var(--primary) 8%, transparent), transparent, color-mix(in srgb, var(--chart-2) 4%, transparent))',
                }}
              />
              <div className={`relative mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-300 ${feature.color}`}>
                <feature.icon size={22} stroke={1.5} />
              </div>
              <h3 className='relative mb-2.5 text-lg font-bold tracking-tight'>{feature.title}</h3>
              <p className='relative text-sm text-muted-foreground leading-relaxed'>{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}