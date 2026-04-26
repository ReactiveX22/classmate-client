'use client';

import { motion } from 'motion/react';
import { Badge } from '@/components/ui/badge';
import { IconBell, IconCalendar, IconAlertCircle } from '@tabler/icons-react';

const notices = [
    {
        id: 1,
        type: 'Urgent',
        icon: IconAlertCircle,
        title: 'Final Exam Schedule Released',
        author: 'Administration',
        time: '2 hours ago',
        color: 'text-red-500 bg-red-500/10 border-red-500/20',
    },
    {
        id: 2,
        type: 'Event',
        icon: IconCalendar,
        title: 'Campus Seminar: Future of AI',
        author: 'Dept Head - Computer Science',
        time: '5 hours ago',
        color: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
    },
    {
        id: 3,
        type: 'General',
        icon: IconBell,
        title: 'Library Hours Extended for Finals Week',
        author: 'Library Staff',
        time: '1 day ago',
        color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    },
];

export function NoticeBoard() {
    return (
        <section id='notices' className='py-24 md:py-32 px-4 sm:px-6 bg-muted/30'>
            <div className='max-w-7xl mx-auto'>
                <div className='grid md:grid-cols-2 gap-12 items-center'>
                    <motion.div
                        className='space-y-6'
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <Badge variant='outline' className='px-3 py-1 border-primary/30 bg-primary/5'>
                            Real-time Communication
                        </Badge>
                        <h2 className='text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight'>
                            Campus-wide notices,{' '}
                            <span className='text-gradient'>delivered instantly.</span>
                        </h2>
                        <p className='text-lg text-muted-foreground leading-relaxed'>
                            Powered by WebSockets, every notice — urgent alerts, department updates, event announcements — reaches students and faculty the moment it&apos;s published. No refreshes, no delays.
                        </p>
                    </motion.div>

                    <motion.div
                        className='relative w-full rounded-2xl border bg-card/60 backdrop-blur-sm shadow-xl overflow-hidden'
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <div className='p-4 border-b bg-muted/30 flex items-center justify-between'>
                            <span className='text-sm font-semibold'>Recent Notices</span>
                            <Badge variant='secondary' className='text-xs'>Live</Badge>
                        </div>
                        <div className='divide-y'>
                            {notices.map((notice) => (
                                <div key={notice.id} className='flex items-start gap-4 p-4 hover:bg-muted/20 transition-colors'>
                                    <div className={`mt-1 p-2 rounded-lg border ${notice.color}`}>
                                        <notice.icon size={16} />
                                    </div>
                                    <div className='flex-1 min-w-0'>
                                        <p className='font-medium text-sm truncate'>{notice.title}</p>
                                        <p className='text-xs text-muted-foreground mt-1'>{notice.author}</p>
                                    </div>
                                    <span className='text-xs text-muted-foreground whitespace-nowrap'>{notice.time}</span>
                                </div>
                            ))}
                        </div>
                        <div className='p-4 bg-muted/10 border-t text-center'>
                            <button className='text-sm font-medium text-primary hover:underline'>
                                View All Notices
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}