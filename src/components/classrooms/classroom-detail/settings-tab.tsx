import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { IconBook, IconCopy } from '@tabler/icons-react';

interface Course {
  title: string;
  code: string;
  credits: number;
  semester: string;
  maxStudents: number;
  status: string;
  description: string | null;
}

interface Classroom {
  section: string;
  classCode: string;
  createdAt: string;
  updatedAt: string;
  description: string | null;
}

interface SettingsTabProps {
  classroom: Classroom;
  course: Course;
  onCopyClassCode: (code: string) => void;
}

export function SettingsTab({
  classroom,
  course,
  onCopyClassCode,
}: SettingsTabProps) {
  return (
    <div className='space-y-6 mt-6'>
      {/* Course Information */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <IconBook size={20} />
            Course Information
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <p className='text-sm font-medium text-muted-foreground mb-1'>
                Course Title
              </p>
              <p className='font-medium'>{course.title}</p>
            </div>
            <div>
              <p className='text-sm font-medium text-muted-foreground mb-1'>
                Course Code
              </p>
              <p className='font-medium'>{course.code}</p>
            </div>
            <div>
              <p className='text-sm font-medium text-muted-foreground mb-1'>
                Credits
              </p>
              <p className='font-medium'>{course.credits}</p>
            </div>
            <div>
              <p className='text-sm font-medium text-muted-foreground mb-1'>
                Semester
              </p>
              <p className='font-medium'>{course.semester}</p>
            </div>
            <div>
              <p className='text-sm font-medium text-muted-foreground mb-1'>
                Max Students
              </p>
              <p className='font-medium'>{course.maxStudents}</p>
            </div>
            <div>
              <p className='text-sm font-medium text-muted-foreground mb-1'>
                Status
              </p>
              <Badge variant='outline'>{course.status}</Badge>
            </div>
          </div>
          {course.description && (
            <div>
              <p className='text-sm font-medium text-muted-foreground mb-1'>
                Course Description
              </p>
              <p className='text-sm'>{course.description}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Classroom Details */}
      <Card>
        <CardHeader>
          <CardTitle>Classroom Details</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <p className='text-sm font-medium text-muted-foreground mb-1'>
                Section
              </p>
              <p className='font-medium'>{classroom.section}</p>
            </div>
            <div>
              <p className='text-sm font-medium text-muted-foreground mb-1'>
                Class Code
              </p>
              <div className='flex items-center gap-2'>
                <code className='font-mono font-bold'>
                  {classroom.classCode}
                </code>
                <Button
                  size='sm'
                  variant='ghost'
                  onClick={() => onCopyClassCode(classroom.classCode)}
                >
                  <IconCopy size={14} />
                </Button>
              </div>
            </div>
            <div>
              <p className='text-sm font-medium text-muted-foreground mb-1'>
                Created
              </p>
              <p className='font-medium'>
                {new Date(classroom.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className='text-sm font-medium text-muted-foreground mb-1'>
                Last Updated
              </p>
              <p className='font-medium'>
                {new Date(classroom.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          {classroom.description && (
            <div>
              <p className='text-sm font-medium text-muted-foreground mb-1'>
                Classroom Description
              </p>
              <p className='text-sm'>{classroom.description}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
