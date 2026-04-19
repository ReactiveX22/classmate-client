'use client';


import {
  IconChalkboard,
  IconBell,
  IconUsers,
  IconClipboardList,
  IconUserCheck,
  IconLock,
} from '@tabler/icons-react';

const features = [
  {
    icon: IconChalkboard,
    title: 'Virtual Classrooms',
    description: 'Post assignments, materials, and questions in a centralized stream for seamless course management.',
  },
  {
    icon: IconBell,
    title: 'Smart Notices',
    description: 'Campus-wide announcements that reach everyone instantly. No more outdated notice boards.',
  },
  {
    icon: IconUsers,
    title: 'Real-time Collaboration',
    description: 'Instant notifications for grades, comments, and deadlines. Stay connected always.',
  },
  {
    icon: IconClipboardList,
    title: 'Assignment Tracking',
    description: 'Seamless submission flow for students and powerful grading tools for teachers.',
  },
  {
    icon: IconUserCheck,
    title: 'Attendance Management',
    description: 'Track presence with one click. Automated records and insights for faculty.',
  },
  {
    icon: IconLock,
    title: 'Role-Based Security',
    description: 'Enterprise-grade access control specifically tailored for students, faculty, and staff.',
  },
];


export function Features() {
  return (
    <section id='features' className='py-24 md:py-32 px-4 sm:px-6 bg-muted/30'>
      <div className='max-w-7xl mx-auto'>
        <div className='mb-16 text-center max-w-3xl mx-auto'>
          <h2 className='text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4'>
            Everything you need to{' '}
            <span className='text-transparent bg-clip-text bg-gradient-to-r from-primary to-chart-2'>
              run your campus
            </span>
          </h2>
          <p className='text-lg sm:text-xl text-muted-foreground'>
            Powerful features designed specifically for every role in the modern university ecosystem.
          </p>
        </div>

        <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8'>
          {features.map((feature, index) => (
            <div
              key={index}
              className='group relative rounded-2xl border bg-card p-6 md:p-8 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1 transform-gpu'
              style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
            >
              <div className='mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-sm group-hover:scale-110 transition-transform duration-300'>
                <feature.icon size={24} stroke={1.5} />
              </div>
              <h3 className='mb-2 text-xl font-semibold tracking-tight'>{feature.title}</h3>
              <p className='text-muted-foreground leading-relaxed'>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}