import { Button } from '@/components/ui/button';
import { IconBook, IconUsers, IconCopy } from '@tabler/icons-react';

interface ClassroomHeaderProps {
  classroom: {
    name: string;
    section: string;
    classCode: string;
  };
  course: {
    code: string;
    maxStudents: number;
    credits: number;
  };
  enrolledCount: number;
  onCopyClassCode: (code: string) => void;
}

export function ClassroomHeader({
  classroom,
  course,
  enrolledCount,
  onCopyClassCode,
}: ClassroomHeaderProps) {
  return (
    <div className='space-y-4'>
      <div className='flex items-start justify-between gap-4'>
        <div className='flex-1 min-w-0'>
          <div className='flex items-center gap-2 flex-wrap'>
            <h1 className='text-xl font-semibold truncate'>{classroom.name}</h1>
          </div>
          <p className='text-sm text-muted-foreground'>
            {course.code} • Section {classroom.section}
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className='flex items-center gap-6 text-sm'>
        <div className='flex items-center gap-2'>
          <IconUsers size={16} className='text-muted-foreground' />
          <span>
            <strong>{enrolledCount}</strong> / {course.maxStudents} students
          </span>
        </div>
        <div className='flex items-center gap-2'>
          <IconBook size={16} className='text-muted-foreground' />
          <span>{course.credits} credits</span>
        </div>
        <div className='flex items-center gap-2'>
          <code className='font-mono'>{classroom.classCode}</code>
          <Button
            size='icon-xs'
            variant='ghost'
            onClick={() => onCopyClassCode(classroom.classCode)}
            title='Copy class code'
          >
            <IconCopy size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
}
