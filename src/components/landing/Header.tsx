'use client';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { ModeToggle } from '@/components/mode-toggle';
import { IconMenu2, IconSchool, IconX } from '@tabler/icons-react';
import Link from 'next/link';
import { useState } from 'react';

const navLinks = [
  { title: 'Features', href: '#features' },
  { title: 'How It Works', href: '#showcase' },
  { title: 'Pricing', href: '#pricing' },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className='fixed top-0 left-0 right-0 z-50 transition-all duration-300 glass border-b border-border/10'>
      <div className='flex h-16 md:h-20 max-w-7xl items-center justify-between mx-auto px-6'>
        {/* Logo */}
        <Link href='/' className='flex items-center gap-2.5 group'>
          <div className='w-9 h-9 bg-primary rounded-xl flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-shadow'>
            <IconSchool size={20} />
          </div>
          <span className='text-xl font-bold tracking-tight'>ClassMate</span>
        </Link>

        {/* Desktop Nav - Centered */}
        <nav className='hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2'>
          {navLinks.map((link) => (
            <Link
              key={link.title}
              href={link.href}
              className='relative py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground group'
            >
              {link.title}
              <span className='absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full' />
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className='hidden md:flex items-center gap-4'>
          <ModeToggle />
          <Link
            href='/login'
            className='text-sm font-medium text-muted-foreground hover:text-foreground transition-colors'
          >
            Login
          </Link>
          <Button
            size='sm'
            nativeButton={false}
            className='rounded-xl px-5 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all active:scale-95'
            render={<Link href='/signup'>Get Started</Link>}
          />
        </div>

        {/* Mobile Nav */}
        <div className='flex md:hidden items-center gap-2'>
          <ModeToggle />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger render={<Button variant='outline' size='icon' />}>
              <IconMenu2 className='h-4 w-4' />
            </SheetTrigger>
            <SheetContent className='w-[300px] sm:w-[360px] glass border-l border-border/10'>
              <SheetHeader>
                <SheetTitle>
                  <Link href='/' className='flex items-center gap-2.5 font-bold text-xl'>
                    <div className='w-9 h-9 bg-primary rounded-xl flex items-center justify-center text-primary-foreground'>
                      <IconSchool size={20} />
                    </div>
                    <span>ClassMate</span>
                  </Link>
                </SheetTitle>
              </SheetHeader>
              <nav className='flex flex-col gap-1 mt-8'>
                {navLinks.map((link) => (
                  <Link
                    key={link.title}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className='px-4 py-3 rounded-xl text-lg font-medium text-muted-foreground transition-all hover:text-foreground hover:bg-primary/5'
                  >
                    {link.title}
                  </Link>
                ))}
                <div className='border-t border-border/10 my-4' />
                <div className='flex flex-col gap-3 px-4'>
                  <Button
                    variant='outline'
                    className='rounded-xl h-12'
                    nativeButton={false}
                    render={<Link href='/login'>Login</Link>}
                  />
                  <Button
                    className='rounded-xl h-12 bg-primary'
                    nativeButton={false}
                    render={<Link href='/signup'>Get Started</Link>}
                  />
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}