import { IconSchool } from '@tabler/icons-react';

export function Footer() {
  return (
    <footer className='py-12 px-6 border-t bg-muted/10'>
      <div className='max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6'>
        <div className='flex items-center gap-2 font-bold text-lg text-muted-foreground'>
          <IconSchool size={20} />
          <span>ClassMate</span>
        </div>
        <p className='text-sm text-muted-foreground'>
          © {new Date().getFullYear()} ClassMate. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
