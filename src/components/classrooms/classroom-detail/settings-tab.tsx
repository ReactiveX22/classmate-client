import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ClassroomDetail, Course } from '@/lib/api/services/classroom.service';
import { IconBook, IconCopy, IconPencil } from '@tabler/icons-react';
import { useState } from 'react';
import { UpdateClassroomDialog } from './settings/update-classroom-dialog';
import { RoleGuard } from '@/components/common/role-guard';
import { Role } from '@/types/auth';

interface SettingsTabProps {
  classroom: ClassroomDetail;
  course: Course;
  onCopyClassCode: (code: string) => void;
}

export function SettingsTab({
  classroom,
  course,
  onCopyClassCode,
}: SettingsTabProps) {
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);

  return (
    <div className='max-w-3xl mx-auto space-y-6 mt-6'>
      <UpdateClassroomDialog
        classroom={classroom}
        open={isUpdateDialogOpen}
        onOpenChange={setIsUpdateDialogOpen}
      />
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <IconBook size={20} />
            Classroom Settings
          </CardTitle>
          <RoleGuard allowedRoles={[Role.Instructor]}>
            <CardAction>
              <Button
                variant='outline'
                size='sm'
                onClick={() => setIsUpdateDialogOpen(true)}
              >
                <IconPencil size={20} /> Update
              </Button>
            </CardAction>
          </RoleGuard>
        </CardHeader>
        <CardContent className='space-y-6'>
          {/* Course Information */}
          <section>
            <h3 className='font-medium mb-4'>Course Information</h3>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
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
              <div className='mt-4'>
                <p className='text-sm font-medium text-muted-foreground mb-1'>
                  Course Description
                </p>
                <p className='text-sm'>{course.description}</p>
              </div>
            )}
          </section>

          <div className='h-px bg-border' />

          {/* Classroom Details */}
          <section>
            <h3 className='font-medium mb-4'>Classroom Details</h3>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <div>
                <p className='text-sm font-medium text-muted-foreground mb-1'>
                  Class Name
                </p>
                <p className='font-medium'>{classroom.name}</p>
              </div>
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
              <div className='mt-4'>
                <p className='text-sm font-medium text-muted-foreground mb-1'>
                  Classroom Description
                </p>
                <p className='text-sm'>{classroom.description}</p>
              </div>
            )}
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
