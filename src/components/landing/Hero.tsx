'use client';

import { Button } from '@/components/ui/button';
import { IconArrowRight, IconBrandGithub } from '@tabler/icons-react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { DashboardMockup } from './DashboardMockup';

export function Hero() {
  return (
    <section className='relative min-h-screen flex items-center pt-20 overflow-hidden'>
      {/* Background Grid */}
      <div className='absolute inset-0 hero-grid opacity-60' />
      {/* Background Radial Glow */}
      <div className='absolute inset-0 hero-radial' />

      {/* Floating Particles */}
      <div className='absolute top-[15%] left-[10%] w-1.5 h-1.5 rounded-full bg-primary/40 animate-pulse-glow' />
      <div className='absolute top-[25%] right-[15%] w-2 h-2 rounded-full bg-chart-2/30 animate-pulse-glow' style={{ animationDelay: '1s' }} />
      <div className='absolute top-[60%] left-[5%] w-1.5 h-1.5 rounded-full bg-primary/40 animate-pulse-glow' style={{ animationDelay: '2s' }} />
      <div className='absolute top-[70%] right-[10%] w-2 h-2 rounded-full bg-primary/30 animate-pulse-glow' style={{ animationDelay: '0.5s' }} />
      <div className='absolute top-[40%] left-[50%] w-1 h-1 rounded-full bg-chart-2/40 animate-pulse-glow' style={{ animationDelay: '1.5s' }} />
      <div className='absolute top-[80%] left-[30%] w-1.5 h-1.5 rounded-full bg-primary/30 animate-pulse-glow' style={{ animationDelay: '3s' }} />

      <div className='relative max-w-7xl mx-auto px-6 w-full py-12'>
        <div className='grid lg:grid-cols-2 gap-12 lg:gap-8 items-center'>
          {/* Left Column: Content */}
          <div className='max-w-xl'>
            {/* Pill Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className='text-sm inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 mb-4'
            >
              <span className='w-2 h-2 rounded-full bg-emerald-500 animate-pulse' />
              <span className='text-xs font-medium text-primary tracking-wide'>Open Source & Free</span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              className='text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-[1.1] tracking-tight text-foreground mb-6'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              The Operating System for{' '}
              <span className='text-gradient'>Modern Campuses.</span>
            </motion.h1>

            {/* Subtext */}
            <motion.p
              className='text-lg text-muted-foreground leading-relaxed mb-10 max-w-md'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              A unified platform for administrators, faculty, and students, manage classrooms, broadcast notices, and track academic progress. All in one beautiful place.
            </motion.p>

            {/* CTAs */}
            <motion.div
              className='flex flex-wrap gap-4 mb-12'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Button
                size='lg'
                nativeButton={false}
                className='btn-shine h-13 px-8 rounded-xl text-base shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all group'
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
                className='h-13 px-8 rounded-xl text-base hover:-translate-y-0.5 transition-all group border-border/60 hover:border-primary/30'
                render={
                  <Link href='https://github.com/ReactiveX22/classmate-client' target='_blank' rel='noopener'>
                    <IconBrandGithub className='mr-2 h-5 w-5' />
                    View on GitHub
                  </Link>
                }
              />
            </motion.div>

            {/* Social proof */}
            {/* <motion.div
              className='flex items-center gap-4'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className='flex -space-x-2.5'>
                {['Admin', 'Dean', 'Prof', 'Dept', '+'].map((label, i) => (
                  <div
                    key={i}
                    className='w-9 h-9 rounded-full border-2 border-background bg-primary/10 flex items-center justify-center text-[9px] font-bold text-primary'
                  >
                    {label}
                  </div>
                ))}
              </div>
              <div>
                <p className='text-xs font-semibold text-foreground'>Trusted by universities</p>
                <p className='text-xs text-muted-foreground'>Open-source & community-driven</p>
              </div>
            </motion.div> */}
          </div>

          {/* Right Column: Dashboard Mockup */}
          <div className='hidden lg:block'>
            <DashboardMockup />
          </div>
        </div>
      </div>
    </section>
  );
}