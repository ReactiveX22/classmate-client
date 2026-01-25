'use client';

import { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

import { IconLoader2 } from '@tabler/icons-react';
import { Pencil } from 'lucide-react';

interface EditableGradeCellProps {
  initialGrade?: number;
  maxPoints: number;
  onSave: (newGrade: number) => void;
  isSaving?: boolean;
}

export function EditableGradeCell({
  initialGrade,
  maxPoints,
  onSave,
  isSaving,
}: EditableGradeCellProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState<string>(
    initialGrade !== undefined && initialGrade !== null
      ? initialGrade.toString()
      : ''
  );
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  const handleBlur = () => {
    setIsEditing(false);
    save();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setIsEditing(false);
      save();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setValue(
        initialGrade !== undefined && initialGrade !== null
          ? initialGrade.toString()
          : ''
      );
    }
  };

  const save = () => {
    if (!value) return;

    const numValue = parseFloat(value);

    if (isNaN(numValue)) {
      toast.error('Grade must be a number');
      setValue(initialGrade?.toString() || '');
      return;
    }

    if (numValue < 0 || numValue > maxPoints) {
      toast.error(`Grade must be between 0 and ${maxPoints}`);
      setValue(initialGrade?.toString() || '');
      return;
    }

    if (numValue !== initialGrade) {
      onSave(numValue);
    }
  };

  if (isEditing) {
    return (
      <div className='flex items-center gap-1'>
        <Input
          ref={inputRef}
          type='number'
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className='w-12 p-0 h-fit text-sm focus-visible:ring-0 rounded-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none border-x-0 border-t-0'
          min={0}
          max={maxPoints}
        />
        <span className='text-muted-foreground'>/ {maxPoints}</span>
      </div>
    );
  }

  return (
    <div
      onClick={() => !isSaving && setIsEditing(true)}
      className={cn(
        'cursor-pointer hover:bg-muted/50 px-2 py-1 rounded-md transition-colors min-w-12 text-center flex items-center justify-start gap-1',
        !initialGrade && initialGrade !== 0 && 'text-muted-foreground italic',
        isSaving && 'opacity-70 cursor-not-allowed'
      )}
    >
      <span>{initialGrade ?? '___'}</span>
      <span className='text-muted-foreground ml-0.5'>/ {maxPoints}</span>
      <span className='ml-4'>
        {isSaving ? (
          <IconLoader2 size={12} className='animate-spin' />
        ) : (
          <Pencil size={12} className='text-muted-foreground' />
        )}
      </span>
    </div>
  );
}
