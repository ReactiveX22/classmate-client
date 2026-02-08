'use client';

import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { ClassroomWithCourse } from '@/lib/api/services/classroom.service';
import Link from 'next/link';

interface ClassroomCardProps {
  data: ClassroomWithCourse;
}

export function ClassroomCard({ data }: ClassroomCardProps) {
  const { classroom, course } = data;

  return (
    <Link
      href={`/dashboard/classrooms/${classroom.id}`}
      className='group block h-full'
    >
      <Card className='md:py-3 h-full transition-colors hover:bg-muted/50 gap-2'>
        <CardHeader className='md:px-3'>
          <div className='space-y-1'>
            <CardTitle className='text-sm line-clamp-1 group-hover:text-primary transition-colors'>
              {classroom.name}
            </CardTitle>
            <p className='text-xs text-muted-foreground'>
              {course.code} • {classroom.section} • {course.credits} Credits
            </p>
          </div>
        </CardHeader>
      </Card>
    </Link>
  );
}
