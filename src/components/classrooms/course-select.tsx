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
import { useCourses } from '@/hooks/use-courses';
import { useState, useEffect, useRef } from 'react';
import { useDebouncedCallback } from '@/hooks/use-debounced-callback';
import { Badge } from '@/components/ui/badge';

interface CourseSelectProps {
  value?: string;
  onValueChange: (value: string | undefined) => void;
  error?: boolean;
}

export function CourseSelect({
  value,
  onValueChange,
  error,
}: CourseSelectProps) {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const isSelectedRef = useRef(false);
  const prevValueRef = useRef(value);

  const updateDebouncedSearch = useDebouncedCallback((val: string) => {
    setDebouncedSearch(val);
  }, 300);

  const { data: response, isLoading } = useCourses({
    page: 1,
    limit: 10,
    search: debouncedSearch,
  });

  const courses = response?.data || [];

  // Sync search input with value when value changes externally
  useEffect(() => {
    if (value !== prevValueRef.current) {
      if (!value) {
        setSearch('');
      } else {
        const found = courses.find((c) => c.id === value);
        if (found) {
          setSearch(found.title);
        }
      }
      prevValueRef.current = value;
    }
  }, [value, courses]);

  // Also try to find the name if we have a value but no search string (e.g. on mount with initial value)
  useEffect(() => {
    if (value && !search && !isLoading && !isSelectedRef.current) {
      const found = courses.find((c) => c.id === value);
      if (found) {
        setSearch(found.title);
      }
    }
  }, [courses, value, search, isLoading]);

  return (
    <Combobox
      value={value || ''}
      onValueChange={(val) => {
        const found = courses.find((c) => c.id === val);
        if (found) {
          isSelectedRef.current = true;
          setSearch(found.title);
        } else if (!val) {
          setSearch('');
        }
        onValueChange(val || undefined);
      }}
    >
      <ComboboxInput
        placeholder='Search course by title or code...'
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
          ) : courses.length === 0 ? (
            <ComboboxEmpty className='py-4'>No courses found.</ComboboxEmpty>
          ) : (
            courses.map((c) => (
              <ComboboxItem key={c.id} value={c.id} className='py-2.5 px-3'>
                <div className='flex flex-col gap-1 w-full'>
                  <div className='flex items-center justify-between gap-2'>
                    <span className='font-semibold text-sm flex items-center gap-1.5'>
                      {c.title}
                    </span>
                    <Badge
                      variant='secondary'
                      className='text-[10px] h-4.5 px-1.5'
                    >
                      {c.code}
                    </Badge>
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
