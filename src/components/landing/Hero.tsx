'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { IconArrowRight, IconPlayerPlay } from '@tabler/icons-react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { DashboardMockup } from './DashboardMockup';

export function Hero() {
  return (
    <section className='relative py-20 md:py-32 px-4 md:px-6 overflow-hidden'>
      {/* Background Glows */}
      <div className='absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none' />
      <div className='absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-chart-2/10 rounded-full blur-[120px] pointer-events-none' />

      <div className='max-w-7xl mx-auto flex flex-col items-center text-center space-y-8 relative z-10'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Badge variant='outline' className='px-2 py-2.5 text-xs font-medium border-primary/30 bg-primary/5'>
            <span className='flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse' />
            New: Real-time Classroom Management
          </Badge>
        </motion.div>

        <motion.h1
          className='text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight max-w-5xl text-balance leading-[1.1]'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          The Operating System for{' '}
          <span className='text-transparent bg-clip-text bg-gradient-to-r from-primary via-chart-2 to-primary'>
            Modern Education
          </span>
        </motion.h1>

        <motion.p
          className='text-lg text-muted-foreground max-w-2xl text-balance'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          A unified platform for students, teachers, and admins to collaborate, manage assignments, and stay informed. Academic life, streamlined.
        </motion.p>

        <motion.div
          className='flex flex-col sm:flex-row items-center gap-4 pt-4'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Button
            size='lg'
            nativeButton={false}
            className='h-13 px-8 rounded-full text-base shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all group'
            render={
              <Link href='/signup'>
                Launch Your Campus
                <IconArrowRight className='ml-2 h-5 w-5 transition-transform group-hover:translate-x-1' />
              </Link>
            }
          />
          <Button
            variant='outline'
            size='lg'
            nativeButton={false}
            className='h-13 px-8 rounded-full text-base group'
            render={
              <Link href='#'>
                <IconPlayerPlay className='mr-2 h-5 w-5 text-primary' />
                Watch Demo
              </Link>
            }
          />
        </motion.div>

        <DashboardMockup />
      </div>
    </section>
  );
}