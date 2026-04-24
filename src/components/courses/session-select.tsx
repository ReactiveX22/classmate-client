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
import { useCourseSessions } from '@/hooks/use-course-sessions';
import { useState, useEffect, useRef, useMemo } from 'react';
import { useDebouncedCallback } from '@/hooks/use-debounced-callback';
import { IconSearch, IconCalendarEvent } from '@tabler/icons-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface SessionSelectProps {
  value?: string;
  onValueChange: (value: string | undefined) => void;
  error?: boolean;
}

export function SessionSelect({
  value,
  onValueChange,
  error,
}: SessionSelectProps) {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [open, setOpen] = useState(false);
  const isSelectedRef = useRef(false);
  const prevValueRef = useRef(value);

  const updateDebouncedSearch = useDebouncedCallback((val: string) => {
    setDebouncedSearch(val);
  }, 300);

  const { data: response, isLoading } = useCourseSessions({
    page: 1,
    limit: 10,
    search: debouncedSearch,
  });

  const sessions = response?.data || [];

  const selectedSession = useMemo(() => {
    return sessions.find((s) => s.id === value);
  }, [sessions, value]);

  // Sync search input with value when value changes externally
  useEffect(() => {
    if (value !== prevValueRef.current) {
      if (!value) {
        setSearch('');
      } else {
        const found = sessions.find((s) => s.id === value);
        if (found) {
          setSearch(found.name);
        }
      }
      prevValueRef.current = value;
    }
  }, [value, sessions]);

  // Also try to find the name if we have a value but no search string
  useEffect(() => {
    if (value && !search && !isLoading && !isSelectedRef.current) {
      const found = sessions.find((s) => s.id === value);
      if (found) {
        setSearch(found.name);
      }
    }
  }, [sessions, value, search, isLoading]);

  return (
    <Combobox
      open={open}
      onOpenChange={setOpen}
      value={value || ''}
      onValueChange={(val) => {
        const found = sessions.find((s) => s.id === val);
        if (found) {
          isSelectedRef.current = true;
          setSearch(found.name);
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
          {selectedSession ? (
            <div className='flex flex-col items-start overflow-hidden'>
              <div className='flex items-center gap-2'>
                <span className='font-semibold truncate'>
                  {selectedSession.name}
                </span>
                {selectedSession.isCurrent && (
                  <Badge variant="secondary" className="text-[9px] px-1 h-4">Current</Badge>
                )}
              </div>
            </div>
          ) : (
            <>
              <IconCalendarEvent className='size-4 text-muted-foreground' />
              <span>Select session...</span>
            </>
          )}
        </div>
      </ComboboxTrigger>

      <ComboboxContent>
        <div className='p-2 border-b'>
          <ComboboxInput
            placeholder='Search sessions...'
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
          ) : sessions.length === 0 ? (
            <ComboboxEmpty className='py-6'>No sessions found.</ComboboxEmpty>
          ) : (
            sessions.map((s) => (
              <ComboboxItem
                key={s.id}
                value={s.id}
                className='py-2 px-3'
              >
                <div className='flex flex-col flex-1 min-w-0'>
                  <div className='flex items-center gap-2'>
                    <span className='font-semibold text-sm truncate'>
                      {s.name}
                    </span>
                    {s.isCurrent && (
                      <Badge variant="secondary" className="text-[9px] px-1 h-4">Current</Badge>
                    )}
                  </div>
                  {s.description && (
                    <span className='text-[11px] text-muted-foreground truncate leading-tight mt-0.5'>
                      {s.description}
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
