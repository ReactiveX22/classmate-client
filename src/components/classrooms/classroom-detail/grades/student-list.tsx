'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useClassroom } from '@/hooks/use-classrooms';
import { ClassroomMember } from '@/lib/api/services/classroom.service';
import { cn } from '@/lib/utils';
import { IconSearch, IconUser } from '@tabler/icons-react';
import { useMemo, useState } from 'react';

interface StudentListProps {
  classroomId: string;
  selectedStudentId: string | null;
  onSelectStudent: (studentId: string) => void;
}

export function StudentList({
  classroomId,
  selectedStudentId,
  onSelectStudent,
}: StudentListProps) {
  const { data: classroom, isLoading } = useClassroom(classroomId);
  const [searchQuery, setSearchQuery] = useState('');

  const students = useMemo(() => {
    if (!classroom?.classroomMembers) return [];

    // Sort students by name
    const sorted = [...classroom.classroomMembers].sort((a, b) =>
      (a.student.name || '').localeCompare(b.student.name || '')
    );

    if (!searchQuery) return sorted;

    const query = searchQuery.toLowerCase();
    return sorted.filter(
      (member) =>
        member.student.name?.toLowerCase().includes(query) ||
        member.student.email?.toLowerCase().includes(query)
    );
  }, [classroom?.classroomMembers, searchQuery]);

  if (isLoading) {
    return (
      <div className='bg-background border-r h-[calc(100vh-12rem)] w-80 shrink-0 flex flex-col'>
        <div className='p-4 border-b space-y-4'>
          <Skeleton className='h-8 w-full' />
          <Skeleton className='h-10 w-full' />
        </div>
        <div className='p-2 space-y-2'>
          {[...Array(5)].map((_, i) => (
            <div key={i} className='flex items-center gap-3 p-2'>
              <Skeleton className='h-8 w-8 rounded-full' />
              <div className='space-y-1 flex-1'>
                <Skeleton className='h-4 w-24' />
                <Skeleton className='h-3 w-16' />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className='bg-background border-r h-[calc(100vh-12rem)] w-80 shrink-0 flex flex-col'>
      {/* Header */}
      <div className='p-4 border-b sticky top-0 bg-background z-10'>
        <h3 className='font-semibold mb-4 flex items-center gap-2'>
          <IconUser className='w-4 h-4 text-muted-foreground' />
          Students ({students.length})
        </h3>
        <div className='relative'>
          <IconSearch className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
          <Input
            placeholder='Search students...'
            className='pl-9 bg-muted/50'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* List */}
      <div className='flex-1 overflow-y-auto p-2 space-y-1'>
        {students.length === 0 ? (
          <div className='text-center py-8 text-muted-foreground text-sm'>
            No students found
          </div>
        ) : (
          students.map((member) => (
            <button
              key={member.studentId}
              onClick={() => onSelectStudent(member.studentId)}
              className={cn(
                'w-full flex items-center gap-3 p-2 rounded-md text-left transition-colors hover:bg-muted/50',
                selectedStudentId === member.studentId &&
                  'bg-primary/10 text-primary hover:bg-primary/10'
              )}
            >
              <Avatar className='h-8 w-8'>
                <AvatarImage src={member.student.image || ''} />
                <AvatarFallback>
                  {member.student.name?.charAt(0) || 'S'}
                </AvatarFallback>
              </Avatar>
              <div className='min-w-0 flex-1'>
                <div className='font-medium text-sm truncate'>
                  {member.student.name}
                </div>
                <div className='text-xs text-muted-foreground truncate opacity-70'>
                  {member.student.email}
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
