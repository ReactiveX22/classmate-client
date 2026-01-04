import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ClassroomDetail, Course } from '@/lib/api/services/classroom.service';
import { IconCopy } from '@tabler/icons-react';

interface ClassroomDetailsProps {
  classroom: ClassroomDetail;
  course: Course;
  onCopyClassCode: (code: string) => void;
}

export function ClassroomDetails({
  classroom,
  course,
  onCopyClassCode,
}: ClassroomDetailsProps) {
  return (
    <div className='flex flex-col gap-4'>
      {/* Classroom Information Section */}
      <section className='space-y-6'>
        <div className='grid grid-cols-2 gap-x-12 gap-y-6 px-1'>
          <DetailBlock
            label='Class Name'
            value={classroom.name}
            className='col-span-2'
          />
          <DetailBlock label='Section' value={classroom.section} />

          <div className='space-y-1.5'>
            <p className='text-[12px] font-medium text-muted-foreground/70'>
              Class Code
            </p>
            <div className='flex items-center gap-3'>
              <span className='text-lg font-mono font-medium text-foreground tracking-tight'>
                {classroom.classCode}
              </span>
              <Button
                size='icon'
                variant='ghost'
                className='h-8 w-8 text-muted-foreground hover:text-primary transition-colors'
                onClick={() => onCopyClassCode(classroom.classCode)}
                title='Copy class code'
              >
                <IconCopy size={16} />
              </Button>
            </div>
          </div>
        </div>

        {classroom.description && (
          <div className='space-y-2 px-1'>
            <p className='text-[12px] font-medium text-muted-foreground/70'>
              Description
            </p>
            <p className='text-sm leading-relaxed whitespace-pre-wrap py-1'>
              {classroom.description}
            </p>
          </div>
        )}
      </section>

      <Separator />

      {/* Course Information Section */}
      <section className='space-y-6'>
        <h3 className='text-sm font-semibold text-muted-foreground px-1'>
          Course Information
        </h3>

        <div className='grid grid-cols-3 gap-x-12 gap-y-6 px-1'>
          <DetailBlock
            label='Course Title'
            value={course.title}
            className='col-span-full'
          />
          <DetailBlock label='Course Code' value={course.code} />
          <DetailBlock label='Credits' value={course.credits.toString()} />
          <DetailBlock label='Semester' value={course.semester} />
        </div>

        {course.description && (
          <div className='space-y-2 px-1'>
            <p className='text-[12px] font-medium text-muted-foreground/70'>
              Course Description
            </p>
            <p className='text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap border-l-2 border-muted pl-4 py-1'>
              {course.description}
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

function DetailBlock({
  label,
  value,
  isBadge,
  className,
}: {
  label: string;
  value: string;
  isBadge?: boolean;
  className?: string;
}) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <p className='text-[12px] font-medium text-muted-foreground/70'>
        {label}
      </p>
      {isBadge ? (
        <Badge
          variant='outline'
          className='rounded-full px-3 py-0.5 font-medium text-[11px] capitalize bg-muted/50 border-border/60'
        >
          {value}
        </Badge>
      ) : (
        <p className='text-[14px] font-medium text-foreground/90'>{value}</p>
      )}
    </div>
  );
}
