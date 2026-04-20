'use client';

import { motion } from 'motion/react';
import {
  IconCheck,
  IconUsers,
  IconChalkboard,
  IconBell,
  IconAlertCircle,
  IconCalendar,
  IconClipboardList,
  IconCircleCheck,
  IconFileText,
  IconPhoto,
  IconLink,
} from '@tabler/icons-react';

// ─── Shared layout wrapper ────────────────────────────────────────────────────
function ShowcaseSection({
  pill,
  pillColor,
  title,
  gradient,
  description,
  bullets,
  bulletColor,
  visual,
  reverse = false,
  bg = false,
}: {
  pill: string;
  pillColor: string;
  title: React.ReactNode;
  gradient?: string;
  description: string;
  bullets: { label: string; sub: string }[];
  bulletColor: string;
  visual: React.ReactNode;
  reverse?: boolean;
  bg?: boolean;
}) {
  return (
    <section id={reverse ? undefined : 'showcase'} className={`relative py-24 md:py-32 px-4 sm:px-6 overflow-hidden ${bg ? 'bg-muted/20' : ''}`}>
      <div className='max-w-7xl mx-auto'>
        <div className={`grid lg:grid-cols-2 gap-16 items-center ${reverse ? '' : ''}`}>
          {/* Content side */}
          <motion.div
            className={reverse ? 'lg:order-2' : ''}
            initial={{ opacity: 0, x: reverse ? 30 : -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border mb-6 ${pillColor}`}>
              <span className='text-xs font-medium'>{pill}</span>
            </div>
            <h2 className='text-3xl md:text-4xl font-extrabold tracking-tight mb-5 leading-[1.1]'>
              {title}
            </h2>
            <p className='text-muted-foreground leading-relaxed mb-8 max-w-md'>
              {description}
            </p>
            <div className='space-y-4'>
              {bullets.map((b) => (
                <div key={b.label} className='flex items-start gap-3'>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${bulletColor}`}>
                    <IconCheck size={12} />
                  </div>
                  <div>
                    <p className='text-sm font-semibold'>{b.label}</p>
                    <p className='text-sm text-muted-foreground'>{b.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Visual side */}
          <motion.div
            className={reverse ? 'lg:order-1' : ''}
            initial={{ opacity: 0, x: reverse ? -30 : 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            {visual}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── Visual: Faculty Management ───────────────────────────────────────────────
function FacultyVisual() {
  const faculty = [
    { name: 'Dr. Anika Rahman', dept: 'Computer Science', courses: 3, avatar: 'AR' },
    { name: 'Prof. James Karim', dept: 'Business Admin', courses: 2, avatar: 'JK' },
    { name: 'Dr. Sarah Hossain', dept: 'Mathematics', courses: 4, avatar: 'SH' },
    { name: 'Prof. David Noel', dept: 'Physics', courses: 2, avatar: 'DN' },
  ];
  return (
    <div className='relative'>
      <div className='rounded-2xl border border-border/40 bg-card shadow-2xl shadow-black/10 overflow-hidden'>
        {/* Header */}
        <div className='px-5 py-4 border-b border-border/30 flex items-center justify-between'>
          <div>
            <p className='text-xs text-muted-foreground'>Admin Panel</p>
            <p className='text-sm font-bold'>Faculty Directory</p>
          </div>
          <div className='px-3 py-1.5 rounded-lg bg-primary/10 text-xs font-semibold text-primary'>
            64 Members
          </div>
        </div>
        {/* Table */}
        <div className='divide-y divide-border/20'>
          {faculty.map((f) => (
            <div key={f.name} className='flex items-center gap-4 px-5 py-3.5 hover:bg-muted/20 transition-colors'>
              <div className='w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary flex-shrink-0'>
                {f.avatar}
              </div>
              <div className='flex-1 min-w-0'>
                <p className='text-sm font-semibold truncate'>{f.name}</p>
                <p className='text-xs text-muted-foreground'>{f.dept}</p>
              </div>
              <div className='flex items-center gap-1.5 text-xs text-muted-foreground'>
                <IconChalkboard size={12} />
                {f.courses} courses
              </div>
              <div className='w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0' />
            </div>
          ))}
        </div>
        <div className='px-5 py-3 border-t border-border/20 bg-muted/10'>
          <button className='text-xs font-medium text-primary hover:underline'>View all faculty →</button>
        </div>
      </div>
      {/* Floating card */}
      <div className='absolute -top-4 -right-4 animate-float'>
        <div className='glass rounded-xl p-3 shadow-xl flex items-center gap-2.5 w-44'>
          <div className='w-7 h-7 rounded-lg bg-emerald-500/15 flex items-center justify-center flex-shrink-0'>
            <IconUsers size={13} className='text-emerald-500' />
          </div>
          <div>
            <p className='text-[11px] font-semibold'>2 Onboarded</p>
            <p className='text-[10px] text-muted-foreground'>Today</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Visual: Classrooms ───────────────────────────────────────────────────────
function ClassroomVisual() {
  const classrooms = [
    { code: 'CS301', name: 'Data Structures', students: 42, color: 'from-primary to-chart-2' },
    { code: 'BUS201', name: 'Business Management', students: 38, color: 'from-emerald-500 to-teal-500' },
    { code: 'MTH401', name: 'Linear Algebra', students: 29, color: 'from-amber-500 to-orange-500' },
  ];
  return (
    <div className='relative'>
      <div className='rounded-2xl border border-border/40 bg-card shadow-2xl shadow-black/10 overflow-hidden'>
        <div className='px-5 py-4 border-b border-border/30 flex items-center justify-between'>
          <div>
            <p className='text-xs text-muted-foreground'>Teacher View</p>
            <p className='text-sm font-bold'>Your Classrooms</p>
          </div>
          <button className='px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold'>
            + New Class
          </button>
        </div>
        <div className='p-4 space-y-3'>
          {classrooms.map((c) => (
            <div key={c.code} className='rounded-xl border border-border/30 p-4 hover:border-primary/20 hover:shadow-sm transition-all cursor-pointer'>
              <div className='flex items-start gap-3'>
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center flex-shrink-0`}>
                  <IconChalkboard size={16} className='text-white' />
                </div>
                <div className='flex-1 min-w-0'>
                  <div className='flex items-center justify-between mb-1'>
                    <p className='text-sm font-bold'>{c.code}</p>
                    <div className='flex items-center gap-1 text-xs text-muted-foreground'>
                      <IconUsers size={11} />
                      {c.students}
                    </div>
                  </div>
                  <p className='text-xs text-muted-foreground'>{c.name}</p>
                  <div className='mt-2 flex items-center gap-1.5'>
                    <div className='flex items-center gap-1 px-1.5 py-0.5 rounded bg-primary/10 text-[9px] font-medium text-primary'>
                      <IconCircleCheck size={9} /> Active
                    </div>
                    <div className='flex items-center gap-1 px-1.5 py-0.5 rounded bg-muted text-[9px] text-muted-foreground'>
                      <IconClipboardList size={9} /> 2 posts
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Floating card */}
      <div className='absolute -bottom-4 -left-4 animate-float-delayed'>
        <div className='glass rounded-xl p-3 shadow-xl flex items-center gap-2.5 w-48'>
          <div className='w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0'>
            <IconClipboardList size={13} className='text-primary' />
          </div>
          <div>
            <p className='text-[11px] font-semibold'>Assignment Posted</p>
            <p className='text-[10px] text-muted-foreground'>CS301 · Due in 3 days</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Visual: Notice Board ─────────────────────────────────────────────────────
function NoticesVisual() {
  const notices = [
    { type: 'Urgent', icon: IconAlertCircle, title: 'Final Exam Schedule Released', author: 'Administration', time: '2 hours ago', color: 'text-red-500 bg-red-500/10 border-red-500/20' },
    { type: 'Event', icon: IconCalendar, title: 'Campus Seminar: Future of AI', author: 'Dept Head · Computer Science', time: '5 hours ago', color: 'text-blue-500 bg-blue-500/10 border-blue-500/20' },
    { type: 'General', icon: IconBell, title: 'Library Hours Extended for Finals Week', author: 'Library Staff', time: '1 day ago', color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' },
  ];
  return (
    <div className='relative'>
      <div className='rounded-2xl border border-border/40 bg-card shadow-2xl shadow-black/10 overflow-hidden'>
        <div className='px-5 py-4 border-b border-border/30 flex items-center justify-between'>
          <div>
            <p className='text-xs text-muted-foreground'>Campus Feed</p>
            <p className='text-sm font-bold'>Recent Notices</p>
          </div>
          <div className='flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20'>
            <span className='w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse' />
            <span className='text-[10px] font-semibold text-emerald-500'>Live</span>
          </div>
        </div>
        <div className='divide-y divide-border/20'>
          {notices.map((n) => (
            <div key={n.title} className='flex items-start gap-4 px-5 py-4 hover:bg-muted/20 transition-colors'>
              <div className={`mt-0.5 p-2 rounded-lg border flex-shrink-0 ${n.color}`}>
                <n.icon size={14} />
              </div>
              <div className='flex-1 min-w-0'>
                <p className='text-sm font-medium truncate'>{n.title}</p>
                <p className='text-xs text-muted-foreground mt-0.5'>{n.author}</p>
              </div>
              <span className='text-xs text-muted-foreground whitespace-nowrap'>{n.time}</span>
            </div>
          ))}
        </div>
        <div className='px-5 py-3 border-t border-border/20 bg-muted/10 text-center'>
          <button className='text-xs font-medium text-primary hover:underline'>View all notices →</button>
        </div>
      </div>
      {/* Floating card */}
      <div className='absolute -top-4 -right-4 animate-float'>
        <div className='glass rounded-xl p-3 shadow-xl flex items-center gap-2.5 w-46'>
          <div className='w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0'>
            <IconBell size={13} className='text-primary' />
          </div>
          <div>
            <p className='text-[11px] font-semibold'>Instant Delivery</p>
            <p className='text-[10px] text-muted-foreground'>Real-time · All roles</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Visual: Resource Sharing ─────────────────────────────────────────────────
function ResourcesVisual() {
  const files = [
    { name: 'Week 5 - Lecture Notes.pdf', size: '2.4 MB', icon: IconFileText, color: 'text-red-500 bg-red-500/10' },
    { name: 'Assignment 3 - Guidelines.docx', size: '840 KB', icon: IconClipboardList, color: 'text-blue-500 bg-blue-500/10' },
    { name: 'Lab Diagram - Circuit.png', size: '1.1 MB', icon: IconPhoto, color: 'text-violet-500 bg-violet-500/10' },
    { name: 'Reference Paper Link', size: 'URL', icon: IconLink, color: 'text-emerald-500 bg-emerald-500/10' },
  ];
  return (
    <div className='relative'>
      <div className='rounded-2xl border border-border/40 bg-card shadow-2xl shadow-black/10 overflow-hidden'>
        <div className='px-5 py-4 border-b border-border/30 flex items-center justify-between'>
          <div>
            <p className='text-xs text-muted-foreground'>CS301 · Data Structures</p>
            <p className='text-sm font-bold'>Course Resources</p>
          </div>
          <button className='px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-semibold'>
            Upload
          </button>
        </div>
        <div className='p-4 space-y-2'>
          {files.map((f) => (
            <div key={f.name} className='flex items-center gap-3 p-3 rounded-xl border border-border/20 hover:border-primary/20 hover:bg-muted/20 transition-all cursor-pointer'>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${f.color}`}>
                <f.icon size={16} />
              </div>
              <div className='flex-1 min-w-0'>
                <p className='text-xs font-medium truncate'>{f.name}</p>
                <p className='text-[10px] text-muted-foreground'>{f.size}</p>
              </div>
              <div className='w-1.5 h-1.5 rounded-full bg-border flex-shrink-0' />
            </div>
          ))}
        </div>
      </div>
      {/* Floating card */}
      <div className='absolute -bottom-4 -right-4 animate-float'>
        <div className='glass rounded-xl p-3 shadow-xl flex items-center gap-2.5 w-44'>
          <div className='w-7 h-7 rounded-lg bg-emerald-500/15 flex items-center justify-center flex-shrink-0'>
            <IconCircleCheck size={13} className='text-emerald-500' />
          </div>
          <div>
            <p className='text-[11px] font-semibold'>File Shared</p>
            <p className='text-[10px] text-muted-foreground'>42 students notified</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────
export function Showcase() {
  return (
    <>
      {/* 1. Faculty Management */}
      <ShowcaseSection
        pill='🏛 Institutional Control'
        pillColor='border-primary/20 bg-primary/5 text-primary'
        title={<>Manage your entire faculty,<br /><span className='text-gradient'>from one place.</span></>}
        description='Onboard instructors, assign them to departments and courses, and manage the full academic roster with a clean, centralized admin panel.'
        bullets={[
          { label: 'Faculty directory & profiles', sub: 'Full visibility into every instructor and their teaching load' },
          { label: 'Role-based access control', sub: 'Admins, instructors, and students each see exactly what they need' },
          { label: 'Departmental organization', sub: 'Group faculty by department for streamlined communication' },
        ]}
        bulletColor='bg-primary/10 text-primary'
        visual={<FacultyVisual />}
        bg={false}
      />

      {/* 2. Interactive Classrooms */}
      <ShowcaseSection
        pill='📚 Academic Tools'
        pillColor='border-emerald-500/20 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400'
        title={<>Classrooms that actually<br /><span className='text-gradient'>feel alive.</span></>}
        description='Teachers create rich course spaces where they can post assignments, manage enrolled students, and keep everything organized — with zero friction.'
        bullets={[
          { label: 'Instant classroom creation', sub: 'Set up a new course in seconds with a name, description, and subject' },
          { label: 'Upcoming deadline tracking', sub: 'Students and teachers always know what\'s due and when' },
          { label: 'Classroom post streams', sub: 'Share updates, materials, and tasks in a dedicated course feed' },
        ]}
        bulletColor='bg-emerald-500/10 text-emerald-500'
        visual={<ClassroomVisual />}
        reverse={true}
        bg={true}
      />

      {/* 3. Campus Notices */}
      <ShowcaseSection
        pill='📢 Campus Communication'
        pillColor='border-blue-500/20 bg-blue-500/5 text-blue-600 dark:text-blue-400'
        title={<>Reach every corner of<br /><span className='text-gradient'>your campus instantly.</span></>}
        description='Broadcast urgent alerts, events, and general announcements to the entire institution in real-time. No more email chains or outdated bulletin boards.'
        bullets={[
          { label: 'Categorized notices', sub: 'Urgent, Event, and General tags keep the feed structured' },
          { label: 'Real-time delivery', sub: 'Built on WebSockets — notices appear instantly for all active users' },
          { label: 'Role-targeted publishing', sub: 'Admins publish campus-wide; teachers publish to their classrooms' },
        ]}
        bulletColor='bg-blue-500/10 text-blue-500'
        visual={<NoticesVisual />}
        bg={false}
      />

      {/* 4. Resource Sharing */}
      <ShowcaseSection
        pill='📁 Resource Hub'
        pillColor='border-violet-500/20 bg-violet-500/5 text-violet-600 dark:text-violet-400'
        title={<>All course materials,<br /><span className='text-gradient'>always in reach.</span></>}
        description='Teachers upload lecture notes, assignments, and reference links directly into their classroom. Students get instant access — organized, versioned, and searchable.'
        bullets={[
          { label: 'Multi-format support', sub: 'PDFs, documents, images, and external links all in one place' },
          { label: 'Classroom-scoped sharing', sub: 'Resources are tied to specific courses — no information leakage' },
          { label: 'Instant student notification', sub: 'Every upload triggers a real-time alert to enrolled students' },
        ]}
        bulletColor='bg-violet-500/10 text-violet-500'
        visual={<ResourcesVisual />}
        reverse={true}
        bg={true}
      />
    </>
  );
}
