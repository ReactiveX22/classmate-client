import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Classroom, Course } from '@/lib/api/services/classroom.service';
import { IconBook, IconChevronRight, IconUsers } from '@tabler/icons-react';
import { Code } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '../ui/badge';

interface ClassroomCardProps {
  classroom: Classroom;
  course: Course;
}

export function ClassroomCard({ classroom, course }: ClassroomCardProps) {
  // These would ideally come from the API
  const studentCount = 0; // Placeholder until count is added to API
  const maxStudents = course.maxStudents || 50;

  return (
    <Card>
      <CardHeader>
        <div className='space-y-1.5'>
          <h3 className='text-lg font-semibold truncate tracking-tight group-hover:text-primary transition-colors'>
            {classroom.name}
          </h3>
          <div className='flex  items-center gap-2 overflow-hidden'>
            <Badge variant='outline' className='text-[11px]'>
              {course.code}
            </Badge>
            <Badge variant='outline' className='text-[11px]'>
              Section {classroom.section}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {classroom.description && (
          <p className='text-[13px] text-muted-foreground line-clamp-2 leading-relaxed min-h-[2.5rem]'>
            {classroom.description}
          </p>
        )}

        <div className='mt-auto pt-4 flex items-center justify-between'>
          <div className='flex items-center gap-4 text-[11px] font-medium text-muted-foreground'>
            <div className='flex items-center gap-1.5'>
              <IconBook className='size-3 opacity-40' />
              <span>{course.credits} Credits</span>
            </div>
            <div className='flex items-center gap-1.5'>
              <Code className='size-3 opacity-40' />
              <span>{classroom.classCode}</span>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <Button
          render={<Link href={`/dashboard/classrooms/${classroom.id}`} />}
          size='sm'
          className='w-full'
          variant='outline'
        >
          Open Classroom
          <IconChevronRight
            size={16}
            className='ml-1 group-hover:translate-x-0.5 transition-transform'
          />
        </Button>
      </CardFooter>
    </Card>
  );
}
