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
import { useSemesters } from '@/hooks/use-semesters';
import { useState, useEffect, useRef, useMemo } from 'react';
import { useDebouncedCallback } from '@/hooks/use-debounced-callback';
import { IconCalendar } from '@tabler/icons-react';
import { cn } from '@/lib/utils';

interface SemesterSelectProps {
  value?: string;
  onValueChange: (value: string | undefined) => void;
  error?: boolean;
}

export function SemesterSelect({
  value,
  onValueChange,
  error,
}: SemesterSelectProps) {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [open, setOpen] = useState(false);
  const isSelectedRef = useRef(false);
  const prevValueRef = useRef(value);

  const updateDebouncedSearch = useDebouncedCallback((val: string) => {
    setDebouncedSearch(val);
  }, 300);

  const { data: response, isLoading } = useSemesters({
    page: 1,
    limit: 10,
    search: debouncedSearch,
  });

  const semesters = useMemo(() => response?.data || [], [response?.data]);

  const selectedSemester = useMemo(() => {
    return semesters.find((s) => s.id === value);
  }, [semesters, value]);

  // Sync search input with value when value changes externally
  useEffect(() => {
    if (value !== prevValueRef.current) {
      if (!value) {
        setSearch('');
      } else {
        const found = semesters.find((s) => s.id === value);
        if (found) {
          setSearch(found.name ? `${found.ordinal} - ${found.name}` : found.ordinal);
        }
      }
      prevValueRef.current = value;
    }
  }, [value, semesters]);

  // Also try to find the name if we have a value but no search string
  useEffect(() => {
    if (value && !search && !isLoading && !isSelectedRef.current) {
      const found = semesters.find((s) => s.id === value);
      if (found) {
        setSearch(found.name ? `${found.ordinal} - ${found.name}` : found.ordinal);
      }
    }
  }, [semesters, value, search, isLoading]);

  return (
    <Combobox
      open={open}
      onOpenChange={setOpen}
      value={value || ''}
      onValueChange={(val) => {
        const found = semesters.find((s) => s.id === val);
        if (found) {
          isSelectedRef.current = true;
          setSearch(found.name ? `${found.ordinal} - ${found.name}` : found.ordinal);
        } else if (!val) {
          setSearch('');
        }
        onValueChange(val || undefined);
        setOpen(false);
      }}
    >
      <ComboboxTrigger
        className={cn(
          'flex h-12 w-full items-center justify-between rounded-md border bg-background px-3 py-2 text-sm transition-all hover:bg-accent/50 focus:outline-hidden focus:ring-2 focus:ring-primary/20',
          error && 'border-destructive',
          !value && 'text-muted-foreground',
        )}
      >
        <div className='flex items-center gap-3 overflow-hidden'>
          {selectedSemester ? (
            <div className='flex flex-col items-start overflow-hidden'>
              <span className='font-semibold truncate w-full'>
                {selectedSemester.ordinal}
              </span>
              {selectedSemester.name && (
                <span className='text-[10px] text-muted-foreground truncate'>
                  {selectedSemester.name}
                </span>
              )}
            </div>
          ) : (
            <>
              <IconCalendar className='size-4 text-muted-foreground' />
              <span>Select semester...</span>
            </>
          )}
        </div>
      </ComboboxTrigger>

      <ComboboxContent>
        <div className='p-2 border-b'>
          <ComboboxInput
            placeholder='Search semesters...'
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
              Searching...
            </div>
          ) : semesters.length === 0 ? (
            <ComboboxEmpty className='py-6'>No semesters found.</ComboboxEmpty>
          ) : (
            semesters.map((s) => (
              <ComboboxItem
                key={s.id}
                value={s.id}
                className='py-2 px-3'
              >
                <div className='flex flex-col flex-1 min-w-0'>
                  <span className='font-semibold text-sm truncate'>
                    {s.ordinal}
                  </span>
                  {s.name && (
                    <span className='text-[11px] text-muted-foreground truncate leading-tight'>
                      {s.name}
                    </span>
                  )}
                </div>
              </ComboboxItem>
            ))
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
