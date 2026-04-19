'use client';

import { motion } from 'motion/react';
import {
  IconLayoutDashboard,
  IconBook,
  IconSpeakerphone,
  IconSettings,
  IconUser,
  IconCircleCheck,
  IconClock
} from '@tabler/icons-react';

export function DashboardMockup() {
  return (
    <motion.div
      className='mt-16 w-full max-w-5xl'
      initial={{ opacity: 0, y: 50, rotateX: 10 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
      style={{ perspective: '1200px' }}
    >
      <div
        className='relative rounded-xl border bg-card/50 backdrop-blur-md shadow-2xl overflow-hidden aspect-video transition-transform duration-500 hover:rotate-x-0 group'
        style={{ transformStyle: 'preserve-3d', transform: 'rotateX(5deg)' }}
      >
        {/* Mock UI - Top Bar */}
        <div className='flex items-center gap-2 px-4 py-3 border-b bg-muted/30'>
          <div className='flex gap-1.5'>
            <div className='h-3 w-3 rounded-full bg-red-400/70' />
            <div className='h-3 w-3 rounded-full bg-yellow-400/70' />
            <div className='h-3 w-3 rounded-full bg-green-400/70' />
          </div>
          <div className='flex-1 mx-4'>
            <div className='h-6 w-64 rounded-md bg-muted/60 mx-auto flex items-center justify-center text-[10px] text-muted-foreground font-medium'>
              classmate.app/dashboard
            </div>
          </div>
          <div className='h-8 w-8 rounded-full bg-primary/20 border border-primary/20 flex items-center justify-center text-[10px] font-bold text-primary'>
            JD
          </div>
        </div>

        <div className='flex h-full overflow-hidden'>
          {/* Mock UI - Sidebar */}
          <div className='hidden md:flex flex-col w-52 border-r p-4 gap-1 bg-muted/10'>
            <div className='mb-6 flex items-center px-2 gap-2'>
               <div className='h-6 w-6 rounded bg-primary flex items-center justify-center text-[10px] font-bold text-white'>C</div>
               <span className='text-sm font-bold tracking-tight'>Classmate</span>
            </div>
            
            <SidebarItem icon={<IconLayoutDashboard size={16} />} label="Dashboard" active />
            <SidebarItem icon={<IconBook size={16} />} label="My Classes" />
            <SidebarItem icon={<IconSpeakerphone size={16} />} label="Notices" />
            
            <div className='mt-auto pb-12 space-y-1'>
              <SidebarItem icon={<IconUser size={16} />} label="Profile" />
              <SidebarItem icon={<IconSettings size={16} />} label="Settings" />
            </div>
          </div>

          {/* Mock UI - Main Content */}
          <div className='flex-1 p-6 overflow-hidden'>
            <div className='flex justify-between items-center mb-6'>
              <div className='space-y-0.5'>
                <h3 className='text-lg font-semibold tracking-tight'>Welcome back, John!</h3>
                <p className='text-xs text-muted-foreground'>Here's what's happening today.</p>
              </div>
              <button className='h-9 px-4 rounded-lg bg-primary text-primary-foreground text-xs font-medium shadow-sm'>
                Join Class
              </button>
            </div>

            <div className='grid grid-cols-3 gap-6'>
              {/* Left Column - Classes */}
              <div className='col-span-2 space-y-4'>
                <h4 className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>Your Classes</h4>
                <div className='grid grid-cols-2 gap-4'>
                  <ClassCard title="CS101: Programming" instructor="Dr. Smith" color="bg-blue-500/5" borderColor="border-blue-500/20" />
                  <ClassCard title="MATH202: Calculus" instructor="Prof. Sarah" color="bg-purple-500/5" borderColor="border-purple-500/20" />
                  <ClassCard title="PHY101: Physics" instructor="Dr. Brown" color="bg-orange-500/5" borderColor="border-orange-500/20" />
                  <div className='rounded-xl border border-dashed border-muted-foreground/20 flex flex-col items-center justify-center h-28 gap-2'>
                    <div className='h-8 w-8 rounded-full bg-muted/20 flex items-center justify-center text-muted-foreground'>+</div>
                    <span className='text-[10px] text-muted-foreground font-medium'>Add Class</span>
                  </div>
                </div>
              </div>

              {/* Right Column - Upcoming */}
              <div className='space-y-4'>
                <h4 className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>Upcoming</h4>
                <div className='rounded-xl border bg-card/50 p-4 space-y-4'>
                  <UpcomingItem title="Lab Report 1" subject="Physics" due="Tomorrow" />
                  <UpcomingItem title="Quiz: Derivatives" subject="Math" due="In 2 days" />
                  <UpcomingItem title="Project Proposal" subject="CS101" due="In 4 days" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Overlay Glow */}
        <div className='absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-transparent pointer-events-none' />
      </div>
    </motion.div>
  );
}

function SidebarItem({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <div className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors cursor-pointer ${active ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted'}`}>
      {icon}
      <span className='text-xs font-medium'>{label}</span>
    </div>
  );
}

function ClassCard({ title, instructor, color, borderColor }: { title: string, instructor: string, color: string, borderColor: string }) {
  return (
    <div className={`rounded-xl border ${borderColor} ${color} p-4 space-y-3 cursor-pointer hover:shadow-sm transition-shadow`}>
      <div className='flex justify-between items-start'>
        <h5 className='text-xs font-bold leading-tight line-clamp-1'>{title}</h5>
        <IconCircleCheck size={14} className='text-primary/60 shrink-0' />
      </div>
      <div className='space-y-2'>
        <div className='flex items-center gap-2'>
          <div className='h-5 w-5 rounded-full bg-muted flex items-center justify-center text-[8px] font-bold text-muted-foreground'>{instructor[0]}</div>
          <span className='text-[10px] text-muted-foreground font-medium'>{instructor}</span>
        </div>
        <div className='h-1.5 w-full bg-muted/30 rounded-full overflow-hidden'>
          <div className='h-full bg-primary/40 w-2/3' />
        </div>
      </div>
    </div>
  );
}

function UpcomingItem({ title, subject, due }: { title: string, subject: string, due: string }) {
  return (
    <div className='space-y-1.5 group/item cursor-pointer'>
      <div className='flex justify-between items-center'>
        <h5 className='text-[11px] font-semibold leading-none'>{title}</h5>
        <span className='text-[9px] text-primary font-bold px-1.5 py-0.5 rounded-full bg-primary/10'>{due}</span>
      </div>
      <div className='flex items-center gap-1.5'>
        <IconClock size={10} className='text-muted-foreground/60' />
        <span className='text-[10px] text-muted-foreground'>{subject}</span>
      </div>
    </div>
  );
}
