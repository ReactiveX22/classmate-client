'use client';

import * as React from 'react';
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
  ComboboxTrigger,
} from '@/components/ui/combobox';
import { useTeachers } from '@/hooks/use-teachers';
import { useState, useEffect, useRef, useMemo } from 'react';
import { useDebouncedCallback } from '@/hooks/use-debounced-callback';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { IconSearch } from '@tabler/icons-react';
import { cn } from '@/lib/utils';

interface TeacherSelectProps {
  value?: string;
  onValueChange: (value: string | undefined) => void;
  error?: boolean;
  currentTeacherId?: string;
}

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();
};

export function TeacherSelect({
  value,
  onValueChange,
  error,
  currentTeacherId,
}: TeacherSelectProps) {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [open, setOpen] = useState(false);
  const isSelectedRef = useRef(false);
  const prevValueRef = useRef(value);

  const updateDebouncedSearch = useDebouncedCallback((val: string) => {
    setDebouncedSearch(val);
  }, 300);

  const { data: response, isLoading } = useTeachers({
    page: 1,
    limit: 10,
    search: debouncedSearch,
  });

  const teachers = response?.data || [];

  const sortedTeachers = useMemo(() => {
    if (!currentTeacherId) return teachers;
    return [...teachers].sort((a, b) => {
      if (a.user.id === currentTeacherId) return -1;
      if (b.user.id === currentTeacherId) return 1;
      return 0;
    });
  }, [teachers, currentTeacherId]);

  const selectedTeacher = useMemo(() => {
    return teachers.find((t) => t.user.id === value);
  }, [teachers, value]);

  // Sync search input with value when value changes externally
  useEffect(() => {
    if (value !== prevValueRef.current) {
      if (!value) {
        setSearch('');
      } else {
        const found = teachers.find((t) => t.user.id === value);
        if (found) {
          setSearch(found.user.name);
        }
      }
      prevValueRef.current = value;
    }
  }, [value, teachers]);

  // Also try to find the name if we have a value but no search string
  useEffect(() => {
    if (value && !search && !isLoading && !isSelectedRef.current) {
      const found = teachers.find((t) => t.user.id === value);
      if (found) {
        setSearch(found.user.name);
      }
    }
  }, [teachers, value, search, isLoading]);

  return (
    <Combobox
      open={open}
      onOpenChange={setOpen}
      value={value || ''}
      onValueChange={(val) => {
        const found = teachers.find((t) => t.user.id === val);
        if (found) {
          isSelectedRef.current = true;
          setSearch(found.user.name);
        } else if (!val) {
          setSearch('');
        }
        onValueChange(val || undefined);
        setOpen(false);
      }}
    >
      <ComboboxTrigger
        className={cn(
          'flex h-14 w-full items-center justify-between rounded-xl border bg-background px-4 py-2 text-sm transition-all hover:bg-accent/50 focus:outline-hidden focus:ring-2 focus:ring-primary/20',
          error && 'border-destructive',
          !value && 'text-muted-foreground',
        )}
      >
        <div className='flex items-center gap-3 overflow-hidden'>
          {selectedTeacher ? (
            <>
              <Avatar className='size-9 border-2 border-background shadow-sm'>
                <AvatarImage
                  src={selectedTeacher.user.image || undefined}
                  alt={selectedTeacher.user.name}
                />
                <AvatarFallback className='text-xs bg-primary/10 text-primary'>
                  {getInitials(selectedTeacher.user.name)}
                </AvatarFallback>
              </Avatar>
              <div className='flex flex-col items-start overflow-hidden'>
                <span className='font-semibold truncate w-full'>
                  {selectedTeacher.user.name}
                </span>
                {selectedTeacher.teacher.title && (
                  <span className='text-[10px] text-muted-foreground truncate'>
                    {selectedTeacher.teacher.title}
                  </span>
                )}
              </div>
            </>
          ) : (
            <>
              <div className='size-9 rounded-full bg-muted flex items-center justify-center'>
                <IconSearch className='size-4 text-muted-foreground' />
              </div>
              <span>Select instructor...</span>
            </>
          )}
        </div>
      </ComboboxTrigger>

      <ComboboxContent >
        <div className='p-2 border-b'>
          <ComboboxInput
            placeholder='Search by name or email...'
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              updateDebouncedSearch(e.target.value);
            }}
            showTrigger={false}
            autoFocus
            className='h-9 text-sm'
          />
        </div>
        <ComboboxList>
          {isLoading ? (
            <div className='flex flex-col items-center justify-center py-6 text-xs text-muted-foreground gap-2'>
              <div className='size-4 animate-spin rounded-full border-2 border-primary border-t-transparent' />
              Searching teachers...
            </div>
          ) : sortedTeachers.length === 0 ? (
            <ComboboxEmpty className='py-6'>No teachers found.</ComboboxEmpty>
          ) : (
            sortedTeachers.map((t) => (
              <ComboboxItem
                key={t.user.id}
                value={t.user.id}
                className='py-2.5 px-3'
              >
                <div className='flex items-center gap-3 w-full'>
                  <Avatar className='size-8'>
                    <AvatarImage
                      src={t.user.image || undefined}
                      alt={t.user.name}
                    />
                    <AvatarFallback className='text-[10px]'>
                      {getInitials(t.user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className='flex flex-col flex-1 min-w-0'>
                    <span className='font-semibold text-sm truncate'>
                      {t.user.name}
                    </span>
                    <div className='flex flex-col gap-0'>
                      {t.teacher.title && (
                        <span className='text-[10px] text-muted-foreground truncate leading-tight'>
                          {t.teacher.title}
                        </span>
                      )}
                      <span className='text-[11px] text-muted-foreground truncate leading-tight'>
                        {t.user.email}
                      </span>
                    </div>
                  </div>
                </div>
              </ComboboxItem>
            ))
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
