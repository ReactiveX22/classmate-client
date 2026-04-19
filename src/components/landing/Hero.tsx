'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'motion/react';
import { IconArrowRight, IconPlayerPlay } from '@tabler/icons-react';
import Link from 'next/link';

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
          <Badge variant='outline' className='px-4 py-1.5 text-sm font-medium border-primary/30 bg-primary/5'>
            <span className='flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse' />
            New: Real-time Classroom Management
          </Badge>
        </motion.div>

        <motion.h1
          className='text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-5xl text-balance leading-[1.1]'
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
          className='text-lg sm:text-xl text-muted-foreground max-w-2xl text-balance'
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

        {/* 3D Dashboard Mockup */}
        <motion.div
          className='mt-16 w-full max-w-5xl'
          initial={{ opacity: 0, y: 50, rotateX: 10 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
          style={{ perspective: '1200px' }}
        >
          <div className='relative rounded-xl border bg-card/50 backdrop-blur-md shadow-2xl overflow-hidden aspect-video transition-transform duration-500 hover:rotate-x-0 group'
            style={{ transformStyle: 'preserve-3d', transform: 'rotateX(5deg)' }}>

            {/* Mock UI - Top Bar */}
            <div className='flex items-center gap-2 px-4 py-3 border-b bg-muted/30'>
              <div className='h-3 w-3 rounded-full bg-red-400/70' />
              <div className='h-3 w-3 rounded-full bg-yellow-400/70' />
              <div className='h-3 w-3 rounded-full bg-green-400/70' />
              <div className='flex-1 mx-4 h-4 w-1/3 rounded bg-muted/60' />
            </div>

            <div className='flex h-full'>
              {/* Mock UI - Sidebar */}
              <div className='hidden md:flex flex-col w-56 border-r p-4 gap-3 bg-muted/10'>
                <div className='h-8 w-3/4 rounded bg-primary/20 mb-4' />
                <div className='h-4 w-full rounded bg-muted/40' />
                <div className='h-4 w-5/6 rounded bg-primary/30' />
                <div className='h-4 w-full rounded bg-muted/40' />
                <div className='h-4 w-4/6 rounded bg-muted/40 mt-auto' />
              </div>

              {/* Mock UI - Main Content */}
              <div className='flex-1 p-6 space-y-4'>
                <div className='h-6 w-1/2 rounded bg-muted/60' />
                <div className='grid grid-cols-3 gap-4'>
                  <div className='h-20 rounded-lg bg-primary/10 border border-primary/20 p-3'>
                    <div className='h-3 w-1/2 rounded bg-primary/30 mb-2' />
                    <div className='h-6 w-3/4 rounded bg-primary/20' />
                  </div>
                  <div className='h-20 rounded-lg bg-chart-3/10 border border-chart-3/20 p-3'>
                    <div className='h-3 w-1/2 rounded bg-chart-3/30 mb-2' />
                    <div className='h-6 w-3/4 rounded bg-chart-3/20' />
                  </div>
                  <div className='h-20 rounded-lg bg-chart-5/10 border border-chart-5/20 p-3'>
                    <div className='h-3 w-1/2 rounded bg-chart-5/30 mb-2' />
                    <div className='h-6 w-3/4 rounded bg-chart-5/20' />
                  </div>
                </div>
                <div className='h-40 rounded-lg border border-border/50 bg-muted/20 p-4'>
                  <div className='h-4 w-1/3 rounded bg-muted/60 mb-4' />
                  <div className='space-y-2'>
                    <div className='h-3 w-full rounded bg-muted/40' />
                    <div className='h-3 w-5/6 rounded bg-muted/40' />
                    <div className='h-3 w-4/6 rounded bg-muted/40' />
                  </div>
                </div>
              </div>
            </div>

            {/* Overlay Glow */}
            <div className='absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-transparent pointer-events-none' />
          </div>
        </motion.div>
      </div>
    </section>
  );
}