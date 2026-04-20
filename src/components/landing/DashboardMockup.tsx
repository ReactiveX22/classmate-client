'use client';

import { motion } from 'motion/react';
import {
  IconLayoutDashboard,
  IconBook,
  IconSpeakerphone,
  IconSettings,
  IconUsers,
  IconShieldCheck,
  IconBell,
  IconAlertCircle,
  IconCalendar,
} from '@tabler/icons-react';

export function DashboardMockup() {
  return (
    <motion.div
      className='relative w-full'
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
    >
      {/* Main window */}
      <div
        className='relative rounded-2xl overflow-hidden border border-border/[0.06] shadow-2xl shadow-black/30'
        style={{ transform: 'rotateY(-5deg) rotateX(2deg)', transformStyle: 'preserve-3d', transition: 'transform 0.6s ease' }}
      >
        {/* Subtle glow behind */}
        <div className='absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-chart-2/5 pointer-events-none z-10' />

        {/* Title bar */}
        <div className='flex items-center gap-2 px-3 py-2 bg-card border-b border-border/40'>
          <div className='flex gap-1'>
            <div className='w-2 h-2 rounded-full bg-red-400/70' />
            <div className='w-2 h-2 rounded-full bg-yellow-400/70' />
            <div className='w-2 h-2 rounded-full bg-green-400/70' />
          </div>
          <div className='flex-1 flex justify-center'>
            <div className='flex items-center gap-2 px-4 py-1 rounded-lg bg-muted/50 text-xs text-muted-foreground'>
              <IconShieldCheck size={10} />
              classmate.app/dashboard
            </div>
          </div>
        </div>

        {/* App Content */}
        <div className='bg-background flex min-h-[380px]'>
          {/* Mini sidebar */}
          <div className='w-10 flex-shrink-0 flex flex-col items-center gap-2 py-3 border-r border-border/30 bg-card/50'>
            <div className='w-7 h-7 rounded-lg bg-primary/15 flex items-center justify-center'>
              <IconLayoutDashboard size={13} className='text-primary' />
            </div>
            <div className='w-7 h-7 rounded-lg hover:bg-muted flex items-center justify-center transition-colors'>
              <IconBook size={13} className='text-muted-foreground' />
            </div>
            <div className='w-7 h-7 rounded-lg hover:bg-muted flex items-center justify-center transition-colors'>
              <IconSpeakerphone size={13} className='text-muted-foreground' />
            </div>
            <div className='w-7 h-7 rounded-lg hover:bg-muted flex items-center justify-center transition-colors'>
              <IconUsers size={13} className='text-muted-foreground' />
            </div>
            <div className='mt-auto w-7 h-7 rounded-lg hover:bg-muted flex items-center justify-center transition-colors'>
              <IconSettings size={13} className='text-muted-foreground' />
            </div>
          </div>

          {/* Main Content */}
          <div className='flex-1 p-5'>
            {/* Greeting */}
            <div className='mb-4'>
              <p className='text-xs text-muted-foreground mb-0.5'>Good morning,</p>
              <p className='text-sm font-semibold'>Welcome back, Dean 👋</p>
            </div>

            {/* Admin Stats Row */}
            <div className='grid grid-cols-3 gap-2 mb-4'>
              {[
                { label: 'Students', value: '1,248', color: 'text-primary' },
                { label: 'Faculty', value: '64', color: 'text-emerald-500' },
                { label: 'Courses', value: '32', color: 'text-chart-2' },
              ].map((stat) => (
                <div key={stat.label} className='p-2.5 rounded-xl bg-muted/40 border border-border/30'>
                  <p className='text-[10px] text-muted-foreground mb-1'>{stat.label}</p>
                  <p className={`text-base font-bold ${stat.color}`}>{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Recent Notices Feed */}
            <p className='text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2'>Recent Notices</p>
            {[
              { type: 'Urgent', title: 'Final Exam Schedule Released', time: '2h ago', color: 'text-red-500 bg-red-500/10' },
              { type: 'Event', title: 'Campus Seminar: Future of AI', time: '5h ago', color: 'text-blue-500 bg-blue-500/10' },
              { type: 'General', title: 'Library Hours Extended for Finals', time: '1d ago', color: 'text-emerald-500 bg-emerald-500/10' },
            ].map((notice) => (
              <div key={notice.title} className='flex items-start gap-2.5 p-2.5 rounded-xl bg-muted/30 border border-border/20 mb-2'>
                <div className={`mt-0.5 px-1.5 py-0.5 rounded text-[9px] font-bold flex-shrink-0 ${notice.color}`}>
                  {notice.type}
                </div>
                <div className='flex-1 min-w-0'>
                  <p className='text-[11px] font-medium leading-snug truncate'>{notice.title}</p>
                </div>
                <span className='text-[9px] text-muted-foreground whitespace-nowrap flex-shrink-0'>{notice.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Notification Card */}
      <div className='absolute -right-6 top-10 animate-float z-20'>
        <div className='glass rounded-xl p-3 shadow-xl flex items-center gap-3 w-52'>
          <div className='w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center flex-shrink-0'>
            <IconBell size={14} className='text-emerald-500' />
          </div>
          <div>
            <p className='text-[11px] font-semibold'>Notice Published!</p>
            <p className='text-[10px] text-muted-foreground'>Exam schedule updated</p>
          </div>
        </div>
      </div>

      {/* Floating Faculty Card */}
      <div className='absolute -left-8 bottom-12 animate-float-delayed z-20'>
        <div className='glass rounded-xl p-3 shadow-xl flex items-center gap-3 w-48'>
          <div className='w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0'>
            <IconUsers size={14} className='text-primary' />
          </div>
          <div>
            <p className='text-[11px] font-semibold'>3 New Faculty</p>
            <p className='text-[10px] text-muted-foreground'>Onboarded today</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
