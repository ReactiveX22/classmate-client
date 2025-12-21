'use client';

import * as React from 'react';
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
} from '@/components/ui/combobox';
import { useTeachers } from '@/hooks/use-teachers';
import { useState, useEffect, useRef } from 'react';
import { useDebouncedCallback } from '@/hooks/use-debounced-callback';
import { Badge } from '@/components/ui/badge';
import { IconMail, IconUser } from '@tabler/icons-react';

interface TeacherSelectProps {
  value?: string;
  onValueChange: (value: string | undefined) => void;
  error?: boolean;
}

export function TeacherSelect({
  value,
  onValueChange,
  error,
}: TeacherSelectProps) {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
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

  // Sync search input with value when value changes externally
  useEffect(() => {
    if (value !== prevValueRef.current) {
      if (!value) {
        setSearch('');
      } else {
        const found = teachers.find((t) => t.teacher.id === value);
        if (found) {
          setSearch(found.user.name);
        }
      }
      prevValueRef.current = value;
    }
  }, [value, teachers]);

  // Also try to find the name if we have a value but no search string (e.g. on mount with initial value)
  useEffect(() => {
    if (value && !search && !isLoading && !isSelectedRef.current) {
      const found = teachers.find((t) => t.teacher.id === value);
      if (found) {
        setSearch(found.user.name);
      }
    }
  }, [teachers, value, search, isLoading]);

  return (
    <Combobox
      value={value || ''}
      onValueChange={(val) => {
        const found = teachers.find((t) => t.teacher.id === val);
        if (found) {
          isSelectedRef.current = true;
          setSearch(found.user.name);
        } else if (!val) {
          setSearch('');
        }
        onValueChange(val || undefined);
      }}
    >
      <ComboboxInput
        placeholder='Search teacher by name or email...'
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          updateDebouncedSearch(e.target.value);
        }}
        data-invalid={error}
      />
      <ComboboxContent>
        <ComboboxList>
          {isLoading ? (
            <ComboboxEmpty className='flex justify-center py-4 text-xs text-muted-foreground'>
              Searching...
            </ComboboxEmpty>
          ) : teachers.length === 0 ? (
            <ComboboxEmpty className='py-4'>No teachers found.</ComboboxEmpty>
          ) : (
            teachers.map((t) => (
              <ComboboxItem
                key={t.teacher.id}
                value={t.teacher.id}
                className='py-2.5 px-3'
              >
                <div className='flex flex-col gap-1 w-full'>
                  <div className='flex items-center justify-between gap-2'>
                    <span className='font-semibold text-sm flex items-center gap-1.5'>
                      <IconUser className='size-3.5 text-muted-foreground' />
                      {t.user.name}
                    </span>
                    {t.teacher.title && (
                      <Badge
                        variant='secondary'
                        className='text-[10px] h-4.5 px-1.5'
                      >
                        {t.teacher.title}
                      </Badge>
                    )}
                  </div>
                  <div className='flex items-center gap-1.5 text-xs text-muted-foreground'>
                    <IconMail className='size-3 text-muted-foreground/70' />
                    {t.user.email}
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
