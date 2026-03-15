'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { IconMenu2, IconSchool } from '@tabler/icons-react';
import Link from 'next/link';
import React from 'react';

interface MenuItem {
  title: string;
  url: string;
  description?: string;
  icon?: React.ReactNode;
  items?: MenuItem[];
}

interface Navbar1Props {
  logo?: {
    url: string;
    src: string;
    alt: string;
    title: string;
  };
  menu?: MenuItem[];
  auth?: {
    login: {
      title: string;
      url: string;
    };
    signup: {
      title: string;
      url: string;
    };
  };
}

export default function Header({
  menu = [
    {
      title: 'Features',
      url: '/#features',
    },
    // {
    //   title: 'Resources',
    //   url: '#',
    //   items: [
    //     {
    //       title: 'Help Center',
    //       description: 'Get all the answers you need right here',
    //       icon: <IconThumbDown className='size-5 shrink-0' />,
    //       url: '/help',
    //     },
    //   ],
    // },
    {
      title: 'Pricing',
      url: '/pricing',
    },
    {
      title: 'Contact',
      url: '#contact',
    },
  ],
  auth = {
    login: { title: 'Login', url: '/login' },
    signup: { title: 'Sign up', url: '/signup' },
  },
}: Navbar1Props) {
  return (
    <section className='sticky top-0 z-50 py-3 backdrop-blur-md bg-background/85 border-b'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Desktop Menu */}
        <nav className='hidden items-center justify-between lg:flex'>
          <div className='flex items-center gap-6'>
            {/* Logo */}
            <Link
              href='/'
              className='flex items-center gap-2 font-bold text-xl hover:opacity-90 transition-opacity'
            >
              <div className='w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground'>
                <IconSchool size={20} />
              </div>
              <span>ClassMate</span>
            </Link>
            <div className='flex items-center'>
              <NavigationMenu>
                <NavigationMenuList>
                  {menu.map((item) => renderMenuItem(item))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>
          <div className='flex gap-2'>
            <Button
              render={<Link href={auth.login.url}>{auth.login.title}</Link>}
              variant='outline'
              size='sm'
              nativeButton={false}
            ></Button>
            <Button
              render={<Link href={auth.signup.url}>{auth.signup.title}</Link>}
              size='sm'
              nativeButton={false}
            ></Button>
          </div>
        </nav>

        {/* Mobile Menu */}
        <div className='block lg:hidden'>
          <div className='flex items-center justify-between'>
            {/* Logo */}
            <Link
              href='/'
              className='flex items-center gap-2 font-bold text-xl hover:opacity-90 transition-opacity'
            >
              <div className='w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground'>
                <IconSchool size={20} />
              </div>
              <span>ClassMate</span>
            </Link>
            <Sheet>
              <SheetTrigger
                render={
                  <Button variant='outline' size='icon' aria-label='Open menu'>
                    <IconMenu2 className='size-4' />
                  </Button>
                }
              ></SheetTrigger>
              <SheetContent className='overflow-y-auto'>
                <SheetHeader>
                  <SheetTitle>
                    <Link
                      href='/'
                      className='flex items-center gap-2 font-bold text-xl hover:opacity-90 transition-opacity'
                    >
                      <div className='w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground'>
                        <IconSchool size={20} />
                      </div>
                      <span>ClassMate</span>
                    </Link>
                  </SheetTitle>
                </SheetHeader>
                <div className='flex flex-col gap-6 p-4'>
                  <Accordion
                    // type='single'
                    // collapsible
                    className='flex w-full flex-col gap-4'
                  >
                    {menu.map((item) => renderMobileMenuItem(item))}
                  </Accordion>

                  <div className='flex flex-col gap-3'>
                    <Button
                      render={
                        <Link href={auth.login.url}>{auth.login.title}</Link>
                      }
                      nativeButton={false}
                      variant='outline'
                    ></Button>
                    <Button
                      render={
                        <Link href={auth.signup.url}>{auth.signup.title}</Link>
                      }
                      nativeButton={false}
                    ></Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </section>
  );
}

const renderMenuItem = (item: MenuItem) => {
  if (item.items) {
    return (
      <NavigationMenuItem key={item.title}>
        <NavigationMenuTrigger className='bg-transparent'>
          {item.title}
        </NavigationMenuTrigger>
        <NavigationMenuContent>
          {item.items.map((subItem) => (
            <NavigationMenuLink
              render={<SubMenuLink item={subItem} />}
              key={subItem.title}
              className='w-80 bg-transparent'
            ></NavigationMenuLink>
          ))}
        </NavigationMenuContent>
      </NavigationMenuItem>
    );
  }

  return (
    <NavigationMenuItem key={item.title}>
      <NavigationMenuLink
        render={
          <Link
            href={item.url}
            className='bg-transparent hover:bg-muted hover:text-accent-foreground group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors'
          >
            {item.title}
          </Link>
        }
      ></NavigationMenuLink>
    </NavigationMenuItem>
  );
};

const renderMobileMenuItem = (item: MenuItem) => {
  if (item.items) {
    return (
      <AccordionItem key={item.title} value={item.title} className='border-b-0'>
        <AccordionTrigger className='text-md py-0 font-semibold hover:no-underline'>
          {item.title}
        </AccordionTrigger>
        <AccordionContent className='mt-2'>
          {item.items.map((subItem) => (
            <SubMenuLink key={subItem.title} item={subItem} />
          ))}
        </AccordionContent>
      </AccordionItem>
    );
  }

  return (
    <Link key={item.title} href={item.url} className='text-md font-semibold'>
      {item.title}
    </Link>
  );
};

const SubMenuLink = ({ item }: { item: MenuItem }) => {
  return (
    <Link
      className='hover:bg-muted hover:text-accent-foreground flex items-center min-w-80 select-none flex-row gap-4 rounded-md p-3 leading-none no-underline outline-none transition-colors'
      href={item.url}
    >
      <div className='text-foreground'>{item.icon}</div>
      <div>
        <div className='text-sm font-semibold'>{item.title}</div>
        {item.description && (
          <p className='text-muted-foreground text-sm leading-snug'>
            {item.description}
          </p>
        )}
      </div>
    </Link>
  );
};
