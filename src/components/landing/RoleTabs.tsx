'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { IconSchool, IconUser, IconUserShield, IconArrowRight } from '@tabler/icons-react';
import Link from 'next/link';

const roles = [
    {
        id: 'student',
        label: 'Student',
        icon: IconUser,
        headline: 'Your entire semester, organized.',
        description: 'View upcoming deadlines, join classes with a code, and access course materials from any device. Never miss an assignment with smart alerts.',
    },
    {
        id: 'teacher',
        label: 'Teacher',
        icon: IconSchool,
        headline: 'Focus on teaching, not paperwork.',
        description: 'Create classrooms in seconds, automate grading workflows, and engage students with real-time posts. Track attendance effortlessly.',
    },
    {
        id: 'admin',
        label: 'Admin',
        icon: IconUserShield,
        headline: 'Total campus oversight.',
        description: 'Manage user roles, broadcast official notices, and monitor academic progress across the organization. Secure and compliant.',
    },
];

export function RoleTabs() {
    const [activeRole, setActiveRole] = useState('student');
    const activeData = roles.find((r) => r.id === activeRole)!;

    return (
        <section id='solutions' className='py-24 md:py-32 px-4 sm:px-6'>
            <div className='max-w-7xl mx-auto'>
                <div className='text-center mb-12'>
                    <h2 className='text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4'>
                        Personalized for your role
                    </h2>
                    <p className='text-lg text-muted-foreground max-w-2xl mx-auto'>
                        One platform, three distinct experiences tailored to how you work.
                    </p>
                </div>

                <div className='flex justify-center mb-12'>
                    <div className='inline-flex items-center gap-2 p-1 rounded-full border bg-muted/50 backdrop-blur-sm'>
                        {roles.map((role) => (
                            <button
                                key={role.id}
                                onClick={() => setActiveRole(role.id)}
                                className={`cursor-pointer relative flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-colors z-10 ${activeRole === role.id ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                                    }`}
                            >
                                {activeRole === role.id && (
                                    <motion.div
                                        layoutId='activeTab'
                                        className='absolute inset-0 bg-primary rounded-full shadow-lg shadow-primary/25'
                                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                                <span className='relative z-10 flex items-center gap-2'>
                                    <role.icon size={18} />
                                    {role.label}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className='relative max-w-4xl mx-auto rounded-2xl border bg-card/50 backdrop-blur-sm p-8 md:p-12 min-h-[300px] overflow-hidden'>
                    <AnimatePresence mode='wait'>
                        <motion.div
                            key={activeRole}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className='flex flex-col md:flex-row items-center gap-8'
                        >
                            <div className='flex-1 space-y-4'>
                                <h3 className='text-2xl md:text-3xl font-bold'>{activeData.headline}</h3>
                                <p className='text-muted-foreground text-lg leading-relaxed'>{activeData.description}</p>
                                <Button
                                    variant='outline'
                                    className='rounded-full group mt-2'
                                    nativeButton={false}
                                    render={
                                        <Link href='/signup'>
                                            Learn more <IconArrowRight className='ml-2 h-4 w-4 transition-transform group-hover:translate-x-1' />
                                        </Link>
                                    }
                                />
                            </div>
                            <div className='flex-1 w-full aspect-video rounded-xl bg-muted/50 border flex items-center justify-center text-muted-foreground/50'>
                                {/* Placeholder for role-specific screenshot/mockup */}
                                <activeData.icon size={64} stroke={1} />
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Decorative glow */}
                    <div className='absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none' />
                </div>
            </div>
        </section>
    );
}