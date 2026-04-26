'use client';

import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Calendar } from 'lucide-react';
import { UpcomingItem } from './upcoming-item';

interface UpcomingSectionProps {
  items: {
    id: string;
    title: string;
    type: 'assignment' | 'announcement' | 'material';
    dueAt: string;
    classroomId: string;
    classroomName: string;
  }[];
  subtext?: string;
}

export function UpcomingSection({ items, subtext }: UpcomingSectionProps) {
  return (
    <div className='space-y-4'>
      <div className='flex items-center gap-3 px-1'>
        <div className='p-2 rounded-xl bg-primary/10 text-primary'>
          <Calendar size={20} />
        </div>
        <div className='space-y-0.5'>
          <h2 className='text-lg font-bold tracking-tight'>Upcoming</h2>
          {subtext && (
            <p className='text-xs text-muted-foreground'>
              {subtext}
            </p>
          )}
        </div>
      </div>

      <Card className='p-0 md:py-0 border-none shadow-none bg-transparent'>
        <CardContent className='p-0 md:px-0'>
          <ScrollArea className='max-h-[450px'>
            {items.length === 0 ? (
              <div className='p-12 text-center border-2 border-dashed rounded-2xl'>
                <div className='mx-auto size-12 rounded-full bg-muted flex items-center justify-center mb-3'>
                  <Calendar className='text-muted-foreground' size={24} />
                </div>
                <p className='text-sm text-muted-foreground font-medium'>
                  No upcoming deadlines.
                </p>
                <p className='text-xs text-muted-foreground/60 mt-1'>
                  You&apos;re all caught up!
                </p>
              </div>
            ) : (
              <div className='space-y-1'>
                {items.map((post) => (
                  <UpcomingItem key={post.id} post={post} />
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
