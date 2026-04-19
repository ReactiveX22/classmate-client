import { IconSchool } from '@tabler/icons-react';
import Link from 'next/link';

const footerLinks = {
  Product: [
    { title: 'Features', href: '#features' },
    { title: 'Roadmap', href: '#' },
    { title: 'Changelog', href: '#' },
  ],
  Company: [
    { title: 'About', href: '#' },
    { title: 'Careers', href: '#' },
    { title: 'Contact', href: '#contact' },
  ],
  Legal: [
    { title: 'Privacy Policy', href: '#' },
    { title: 'Terms of Service', href: '#' },
  ],
};

export function Footer() {
  return (
    <footer className='border-t bg-muted/10 py-12 px-6'>
      <div className='max-w-7xl mx-auto grid md:grid-cols-4 gap-8'>
        {/* Brand */}
        <div className='space-y-4'>
          <Link href='/' className='flex items-center gap-2 font-bold text-xl'>
            <div className='w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground'>
              <IconSchool size={20} />
            </div>
            <span>ClassMate</span>
          </Link>
          <p className='text-sm text-muted-foreground leading-relaxed'>
            Academic life with zero friction. The modern operating system for education.
          </p>
        </div>

        {/* Links */}
        {Object.entries(footerLinks).map(([category, links]) => (
          <div key={category}>
            <h3 className='font-semibold text-sm mb-4'>{category}</h3>
            <ul className='space-y-3'>
              {links.map((link) => (
                <li key={link.title}>
                  <Link href={link.href} className='text-sm text-muted-foreground hover:text-foreground transition-colors'>
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className='max-w-7xl mx-auto mt-12 pt-6 border-t flex flex-col md:flex-row justify-between items-center gap-4'>
        <p className='text-sm text-muted-foreground'>
          © {new Date().getFullYear()} ClassMate. All rights reserved.
        </p>
        <div className='flex items-center gap-4'>
          {/* Replace with actual Social Icon components if available */}
          <Link href='#' className='text-muted-foreground hover:text-foreground transition-colors'>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0 -1 -3.5c3 0 6 -2 6 -5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" /></svg>
          </Link>
          <Link href='#' className='text-muted-foreground hover:text-foreground transition-colors'>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4l11.733 16h4.267l-11.733 -16z" /><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" /></svg>
          </Link>
          <Link href='#' className='text-muted-foreground hover:text-foreground transition-colors'>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0 -2 -2a2 2 0 0 0 -2 2v7h-4v-7a6 6 0 0 1 6 -6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>
          </Link>
        </div>
      </div>
    </footer>
  );
}