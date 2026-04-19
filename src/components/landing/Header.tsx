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
  { title: 'Solutions', href: '#solutions' },
  { title: 'Notices', href: '#notices' },
  { title: 'Contact', href: '#contact' },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className='sticky top-0 z-50 w-full border-b border-border/40 bg-background/60 backdrop-blur-xl supports-[backdrop-filter]:bg-background/40'>
      <div className='container flex h-16 max-w-screen-2xl items-center justify-between mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Logo */}
        <Link href='/' className='flex items-center gap-2 font-bold text-xl transition-opacity hover:opacity-80'>
          <div className='w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground'>
            <IconSchool size={20} />
          </div>
          <span>ClassMate</span>
        </Link>

        {/* Desktop Nav */}
        <nav className='hidden md:flex items-center gap-6'>
          {navLinks.map((link) => (
            <Link
              key={link.title}
              href={link.href}
              className='text-sm font-medium text-muted-foreground transition-colors hover:text-foreground'
            >
              {link.title}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className='hidden md:flex items-center gap-3'>
          <ModeToggle />
          <Button variant='ghost' size='sm' nativeButton={false} render={<Link href='/login'>Login</Link>} />
          <Button
            size='sm'
            nativeButton={false}
            className='rounded-full shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-shadow'
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
            <SheetContent className='w-[300px] sm:w-[360px]'>
              <SheetHeader>
                <SheetTitle>
                  <Link href='/' className='flex items-center gap-2 font-bold text-xl'>
                    <div className='w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground'>
                      <IconSchool size={20} />
                    </div>
                    <span>ClassMate</span>
                  </Link>
                </SheetTitle>
              </SheetHeader>
              <nav className='flex flex-col gap-4 mt-8'>
                {navLinks.map((link) => (
                  <Link
                    key={link.title}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className='text-lg font-medium text-muted-foreground transition-colors hover:text-foreground'
                  >
                    {link.title}
                  </Link>
                ))}
                <div className='flex flex-col gap-3 mt-4'>
                  <Button variant='outline' nativeButton={false} render={<Link href='/login'>Login</Link>} />
                  <Button nativeButton={false} render={<Link href='/signup'>Get Started</Link>} />
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}