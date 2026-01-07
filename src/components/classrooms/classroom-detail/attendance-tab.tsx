'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Progress, ProgressLabel } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { cn, getInitials } from '@/lib/utils';
import { format } from 'date-fns';
import {
  Calendar,
  Check,
  CheckCheck,
  Clock,
  Search,
  StickyNote,
  X,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';

// Types
type AttendanceStatus = 'present' | 'absent' | 'late' | 'pending';

interface StudentAttendance {
  id: string;
  name: string;
  studentId: string;
  avatar?: string;
  status: AttendanceStatus;
  note?: string;
}

// Fake data for demonstration
const FAKE_STUDENTS: StudentAttendance[] = [
  {
    id: '1',
    name: 'Alex Johnson',
    studentId: '1824',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
    status: 'present',
  },
  {
    id: '2',
    name: 'Beatriz Silva',
    studentId: '1825',
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    status: 'absent',
    note: 'Medical appointment',
  },
  {
    id: '3',
    name: 'Caleb Robinson',
    studentId: '1826',
    status: 'late',
  },
  {
    id: '4',
    name: 'Diana Prince',
    studentId: '1827',
    avatar:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
    status: 'pending',
  },
  {
    id: '5',
    name: 'Ethan Lee',
    studentId: '1828',
    status: 'pending',
  },
  {
    id: '6',
    name: 'Fiona Chen',
    studentId: '1829',
    avatar:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
    status: 'present',
  },
  {
    id: '7',
    name: 'Gabriel Martinez',
    studentId: '1830',
    status: 'present',
  },
  {
    id: '8',
    name: 'Hannah Kim',
    studentId: '1831',
    avatar:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100',
    status: 'pending',
  },
];

interface AttendanceTabProps {
  classroomId: string;
  isTeacher?: boolean;
}

const statusConfig: Record<
  AttendanceStatus,
  { label: string; color: string; icon: React.ReactNode; bgColor: string }
> = {
  present: {
    label: 'Present',
    color: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-500/20',
    icon: <Check className='size-3.5' />,
  },
  absent: {
    label: 'Absent',
    color: 'text-red-600 dark:text-red-400',
    bgColor: 'bg-red-500/10 border-red-500/20 hover:bg-red-500/20',
    icon: <X className='size-3.5' />,
  },
  late: {
    label: 'Late',
    color: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-amber-500/10 border-amber-500/20 hover:bg-amber-500/20',
    icon: <Clock className='size-3.5' />,
  },
  pending: {
    label: 'Pending',
    color: 'text-muted-foreground',
    bgColor: 'bg-muted/50 border-muted hover:bg-muted',
    icon: null,
  },
};

export function AttendanceTab({
  classroomId,
  isTeacher = true,
}: AttendanceTabProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [students, setStudents] = useState<StudentAttendance[]>(FAKE_STUDENTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [noteStudent, setNoteStudent] = useState<string | null>(null);
  const [noteValue, setNoteValue] = useState('');
  const [hasChanges, setHasChanges] = useState(false);

  // Scroll to card when attendance tab is selected
  useEffect(() => {
    // Small delay to ensure the tab content is rendered
    const timer = setTimeout(() => {
      cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const filteredStudents = useMemo(() => {
    if (!searchQuery.trim()) return students;
    const query = searchQuery.toLowerCase();
    return students.filter(
      (s) =>
        s.name.toLowerCase().includes(query) ||
        s.studentId.toLowerCase().includes(query)
    );
  }, [students, searchQuery]);

  const stats = useMemo(() => {
    const present = students.filter((s) => s.status === 'present').length;
    const absent = students.filter((s) => s.status === 'absent').length;
    const late = students.filter((s) => s.status === 'late').length;
    const pending = students.filter((s) => s.status === 'pending').length;
    const total = students.length;
    const completed = total - pending;
    return { present, absent, late, pending, total, completed };
  }, [students]);

  const progressPercentage = (stats.completed / stats.total) * 100;

  const updateStatus = (studentId: string, status: AttendanceStatus) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, status } : s))
    );
    setHasChanges(true);
  };

  const markAllPresent = () => {
    setStudents((prev) => prev.map((s) => ({ ...s, status: 'present' })));
    setHasChanges(true);
  };

  const handleSaveNote = (studentId: string) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, note: noteValue } : s))
    );
    setNoteStudent(null);
    setNoteValue('');
    setHasChanges(true);
  };

  const openNoteEditor = (student: StudentAttendance) => {
    setNoteStudent(student.id);
    setNoteValue(student.note || '');
  };

  const handleSave = () => {
    toast.success('Attendance saved successfully!', {
      description: `Recorded ${stats.present} present, ${
        stats.absent
      } absent, ${stats.late} late for ${format(
        selectedDate,
        'MMMM d, yyyy'
      )}.`,
    });
    setHasChanges(false);
  };

  const handleCancel = () => {
    setStudents(FAKE_STUDENTS);
    setHasChanges(false);
  };

  return (
    <div ref={cardRef} className='mt-6 space-y-4 scroll-mt-20'>
      <Card>
        <CardHeader>
          <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between w-full'>
            <div>
              <CardTitle className='text-xl'>Daily Attendance</CardTitle>
              <p className='text-muted-foreground text-sm mt-1'>
                Track student attendance for each class session
              </p>
            </div>
            <div className='flex items-center gap-2'>
              <Popover>
                <PopoverTrigger
                  render={
                    <Button variant='outline' size='sm' className='gap-2'>
                      <Calendar className='size-4' />
                      {format(selectedDate, 'MMM d, yyyy')}
                    </Button>
                  }
                />
                <PopoverContent className='w-auto p-0' align='end'>
                  <CalendarComponent
                    mode='single'
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardHeader>

        <CardContent className='space-y-4'>
          {/* Search and Actions Bar */}
          <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
            <div className='relative max-w-sm flex-1'>
              <Search className='absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground' />
              <Input
                placeholder='Filter by name or ID...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='pl-9'
              />
            </div>
            <div className='flex items-center gap-3'>
              {/* Progress indicator */}
              <div className='hidden sm:flex items-center gap-3 text-sm text-muted-foreground'>
                <span className='font-medium'>PROGRESS</span>
                <div className='w-32'>
                  <Progress value={progressPercentage}>
                    <ProgressLabel className='sr-only'>Progress</ProgressLabel>
                  </Progress>
                </div>
              </div>
              <Button
                variant='outline'
                size='sm'
                onClick={markAllPresent}
                className='gap-2'
              >
                <CheckCheck className='size-4' />
                Mark All Present
              </Button>
            </div>
          </div>

          {/* Attendance Table */}
          <div className='rounded-lg border'>
            <Table>
              <TableHeader>
                <TableRow className='hover:bg-transparent'>
                  <TableHead className='w-[280px]'>Student</TableHead>
                  <TableHead className='w-[100px]'>ID</TableHead>
                  <TableHead className='w-[220px]'>Status</TableHead>
                  <TableHead className='text-right'>Note</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.id} className='group'>
                    <TableCell>
                      <div className='flex items-center gap-3'>
                        <Avatar>
                          {student.avatar && (
                            <AvatarImage
                              src={student.avatar}
                              alt={student.name}
                            />
                          )}
                          <AvatarFallback>
                            {getInitials(student.name)}
                          </AvatarFallback>
                        </Avatar>
                        <span className='font-medium'>{student.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className='text-muted-foreground'>
                      {student.studentId}
                    </TableCell>
                    <TableCell>
                      <div className='flex items-center gap-1.5'>
                        {(
                          ['present', 'absent', 'late'] as AttendanceStatus[]
                        ).map((status) => {
                          const config = statusConfig[status];
                          const isActive = student.status === status;
                          return (
                            <button
                              key={status}
                              onClick={() => updateStatus(student.id, status)}
                              className={cn(
                                'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all',
                                isActive
                                  ? `${config.bgColor} ${config.color} border-current`
                                  : 'border-transparent bg-muted/30 text-muted-foreground hover:bg-muted/60'
                              )}
                            >
                              {isActive && config.icon}
                              {config.label}
                            </button>
                          );
                        })}
                      </div>
                    </TableCell>
                    <TableCell className='text-right'>
                      <Popover
                        open={noteStudent === student.id}
                        onOpenChange={(open) => {
                          if (!open) {
                            setNoteStudent(null);
                            setNoteValue('');
                          }
                        }}
                      >
                        <PopoverTrigger
                          render={
                            <Button
                              variant='ghost'
                              size='icon-sm'
                              onClick={() => openNoteEditor(student)}
                              className={cn(
                                'relative',
                                student.note &&
                                  'text-primary after:absolute after:-right-0.5 after:-top-0.5 after:size-2 after:rounded-full after:bg-primary'
                              )}
                            >
                              <StickyNote className='size-4' />
                            </Button>
                          }
                        />
                        <PopoverContent align='end' className='w-72 space-y-3'>
                          <div>
                            <p className='text-sm font-medium mb-2'>
                              Note for {student.name}
                            </p>
                            <Textarea
                              placeholder='Add a note (e.g., reason for absence)...'
                              value={noteValue}
                              onChange={(e) => setNoteValue(e.target.value)}
                              className='resize-none'
                              rows={3}
                            />
                          </div>
                          <div className='flex justify-end gap-2'>
                            <Button
                              variant='ghost'
                              size='sm'
                              onClick={() => {
                                setNoteStudent(null);
                                setNoteValue('');
                              }}
                            >
                              Cancel
                            </Button>
                            <Button
                              size='sm'
                              onClick={() => handleSaveNote(student.id)}
                            >
                              Save Note
                            </Button>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>

        {/* Footer with stats and actions */}
        <CardFooter className='border-t flex items-center justify-between'>
          <div className='flex items-center gap-6 text-sm'>
            <div className='flex items-center gap-2'>
              <span className='size-2 rounded-full bg-emerald-500' />
              <span className='text-muted-foreground'>
                {stats.present} Present
              </span>
            </div>
            <div className='flex items-center gap-2'>
              <span className='size-2 rounded-full bg-red-500' />
              <span className='text-muted-foreground'>
                {stats.absent} Absent
              </span>
            </div>
            <div className='flex items-center gap-2'>
              <span className='size-2 rounded-full bg-amber-500' />
              <span className='text-muted-foreground'>{stats.late} Late</span>
            </div>
            <span className='text-muted-foreground'>
              {stats.pending} Pending
            </span>
          </div>
          <div className='flex items-center gap-2'>
            <Button
              variant='outline'
              onClick={handleCancel}
              disabled={!hasChanges}
            >
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!hasChanges}>
              Save
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
