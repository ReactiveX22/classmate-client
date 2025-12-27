import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { IconUsers, IconUserPlus } from '@tabler/icons-react';

interface Teacher {
  name: string;
  email: string;
}

interface Student {
  name: string;
  email: string;
}

interface ClassroomMember {
  studentId: string;
  student: Student;
  joinedAt: string;
}

interface PeopleTabProps {
  teacher: Teacher;
  classroomMembers: ClassroomMember[];
  enrolledCount: number;
  onAddStudents: () => void;
}

export function PeopleTab({
  teacher,
  classroomMembers,
  enrolledCount,
  onAddStudents,
}: PeopleTabProps) {
  return (
    <div className='space-y-6 mt-6'>
      {/* Teacher Section */}
      <Card>
        <CardHeader>
          <CardTitle className='text-lg'>Instructor</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex items-center gap-4'>
            <Avatar className='size-12 border-2'>
              <AvatarFallback className='text-base font-semibold'>
                {teacher.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </AvatarFallback>
            </Avatar>
            <div className='flex-1 min-w-0'>
              <p className='font-medium'>{teacher.name}</p>
              <p className='text-sm text-muted-foreground truncate'>
                {teacher.email}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Students Section */}
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div>
              <CardTitle className='text-lg'>
                Students ({enrolledCount})
              </CardTitle>
              <CardDescription>
                Manage students enrolled in this classroom
              </CardDescription>
            </div>
            <Button onClick={onAddStudents}>
              <IconUserPlus className='mr-2 h-4 w-4' />
              Add Students
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {enrolledCount > 0 ? (
            <div className='space-y-3'>
              {classroomMembers.map((member) => (
                <div
                  key={member.studentId}
                  className='flex items-center gap-4 p-3 rounded-lg hover:bg-accent/50 transition-colors'
                >
                  <Avatar className='size-10 border'>
                    <AvatarFallback>
                      {member.student.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className='flex-1 min-w-0'>
                    <p className='font-medium'>{member.student.name}</p>
                    <p className='text-sm text-muted-foreground truncate'>
                      {member.student.email}
                    </p>
                  </div>
                  <div className='text-xs text-muted-foreground'>
                    Joined {new Date(member.joinedAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className='flex flex-col items-center justify-center py-12 px-4 border-2 border-dashed rounded-lg'>
              <IconUsers size={48} className='text-muted-foreground mb-4' />
              <h3 className='text-lg font-semibold mb-2'>No students yet</h3>
              <p className='text-sm text-muted-foreground text-center mb-4'>
                Add students to get started with your classroom
              </p>
              <Button onClick={onAddStudents}>
                <IconUserPlus className='mr-2 h-4 w-4' />
                Add Your First Student
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
