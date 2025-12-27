'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useStudents } from '@/hooks/use-students';
import { useAddStudentsToClassroom } from '@/hooks/use-classrooms';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';

interface AddStudentsToClassroomDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  classroomId: string;
  classroomName: string;
}

export function AddStudentsToClassroomDialog({
  open,
  onOpenChange,
  classroomId,
  classroomName,
}: AddStudentsToClassroomDialogProps) {
  const [search, setSearch] = React.useState('');
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const addStudentsMutation = useAddStudentsToClassroom();

  const { data: response, isLoading } = useStudents({
    page: 1,
    limit: 50,
    search: search || undefined,
  });

  const students = response?.data || [];

  const toggleStudent = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleAddStudents = async () => {
    if (selectedIds.length === 0) {
      toast.error('Please select at least one student');
      return;
    }

    setIsSubmitting(true);
    try {
      await addStudentsMutation.mutateAsync({
        classroomId,
        studentIds: selectedIds,
      });

      onOpenChange(false);
      setSelectedIds([]);
      setSearch('');
    } catch (error) {
      // Errors are already toasted by the mutation onError handler
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[500px] gap-0 p-0 overflow-hidden'>
        <div className='p-6 border-b'>
          <DialogHeader>
            <DialogTitle>Add Students</DialogTitle>
            <DialogDescription>
              Add students to <strong>{classroomName}</strong>.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className='p-4 border-b bg-muted/30'>
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground' />
            <Input
              placeholder='Search students by name or ID...'
              className='pl-9 bg-background'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <ScrollArea className='h-[300px]'>
          <div className='p-2'>
            {isLoading ? (
              <div className='flex flex-col items-center justify-center py-8 text-sm text-muted-foreground gap-2'>
                <div className='size-4 animate-spin rounded-full border-2 border-primary border-t-transparent' />
                Searching students...
              </div>
            ) : students.length === 0 ? (
              <div className='py-8 text-center text-sm text-muted-foreground'>
                No students found.
              </div>
            ) : (
              <div className='space-y-1'>
                {students
                  .filter((item) => item.student !== null)
                  .map((item) => (
                    <div
                      key={item.student!.id}
                      className={cn(
                        'flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors hover:bg-accent/50 group',
                        selectedIds.includes(item.student!.id) && 'bg-accent'
                      )}
                      onClick={() => toggleStudent(item.student!.id)}
                    >
                      <Checkbox
                        checked={selectedIds.includes(item.student!.id)}
                        onCheckedChange={() => toggleStudent(item.student!.id)}
                        className='size-5'
                      />
                      <Avatar className='size-9 border'>
                        <AvatarFallback className='text-xs'>
                          {item.user.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className='flex-1 min-w-0'>
                        <p className='text-sm font-medium leading-none truncate'>
                          {item.user.name}
                        </p>
                        <p className='text-xs text-muted-foreground truncate mt-1'>
                          {item.student?.studentId || 'No ID'} •{' '}
                          {item.user.email}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </ScrollArea>

        <div className='p-6 border-t bg-muted/10 flex items-center justify-between'>
          <div className='text-sm text-muted-foreground'>
            {selectedIds.length > 0 ? (
              <span className='font-medium text-primary'>
                {selectedIds.length} selected
              </span>
            ) : (
              'Select students'
            )}
          </div>
          <div className='flex items-center gap-3'>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              size='sm'
              onClick={handleAddStudents}
              className='px-6'
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Adding...' : 'Add Students'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
