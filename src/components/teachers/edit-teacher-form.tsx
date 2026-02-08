'use client';

import { Button } from '@/components/ui/button';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useUpdateTeacher } from '@/hooks/use-teachers';
import { TeacherData } from '@/lib/api/services/teacher.service';
import { useForm } from '@tanstack/react-form';
import { useState } from 'react';
import { z } from 'zod';
import { toast } from 'sonner';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

const editTeacherSchema = z.object({
  name: z.string().min(1, 'Name is required e.g. "John Doe"'),
  title: z.string(),
  joinDate: z.string(),
});

interface EditTeacherFormProps {
  teacher: TeacherData;
  onSuccess?: () => void;
}

export function EditTeacherForm({ teacher, onSuccess }: EditTeacherFormProps) {
  const updateTeacherMutation = useUpdateTeacher();

  const form = useForm({
    defaultValues: {
      name: teacher.user.name || '',
      title: teacher.teacher.title || '',
      joinDate: teacher.teacher.joinDate
        ? new Date(teacher.teacher.joinDate).toISOString().split('T')[0]
        : '',
    },
    validators: {
      onChange: editTeacherSchema,
    },
    onSubmit: async ({ value }) => {
      await updateTeacherMutation.mutateAsync(
        {
          id: teacher.user.id,
          data: {
            name: value.name,
            title: value.title || undefined,
            joinDate: value.joinDate || undefined,
          },
        },
        {
          onSuccess: () => {
            onSuccess?.();
          },
        },
      );
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className='flex flex-col gap-4 p-1'
    >
      <FieldGroup>
        <form.Field name='name'>
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && field.state.meta.errors.length > 0;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Full Name</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder='e.g. John Doe'
                  aria-invalid={isInvalid}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        <form.Field name='title'>
          {(field) => {
            return (
              <Field>
                <FieldLabel htmlFor={field.name}>Title (Optional)</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder='e.g. Senior Math Instructor'
                />
              </Field>
            );
          }}
        </form.Field>

        <form.Field name='joinDate'>
          {(field) => {
            return (
              <Field className='flex flex-col'>
                <FieldLabel htmlFor={field.name}>
                  Join Date (Optional)
                </FieldLabel>
                <Popover>
                  <PopoverTrigger
                    render={
                      <Button
                        type='button'
                        variant={'outline'}
                        className={cn(
                          'w-full pl-3 text-left font-normal',
                          !field.state.value && 'text-muted-foreground',
                        )}
                      >
                        {field.state.value ? (
                          format(new Date(field.state.value), 'PPP')
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                      </Button>
                    }
                  ></PopoverTrigger>
                  <PopoverContent className='w-auto p-0' align='start'>
                    <Calendar
                      mode='single'
                      selected={
                        field.state.value
                          ? new Date(field.state.value)
                          : undefined
                      }
                      onSelect={(date) => {
                        field.handleChange(
                          date ? format(date, 'yyyy-MM-dd') : '',
                        );
                      }}
                      disabled={(date) =>
                        date > new Date() || date < new Date('1900-01-01')
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </Field>
            );
          }}
        </form.Field>
      </FieldGroup>

      {updateTeacherMutation.error && (
        <div className='text-sm text-red-500 bg-red-50 border border-red-200 rounded-md p-3'>
          {updateTeacherMutation.error.response?.data?.message ||
            updateTeacherMutation.error.message ||
            'Failed to update teacher'}
        </div>
      )}

      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
      >
        {([canSubmit, isSubmitting]) => (
          <Button
            type='submit'
            className='w-full mt-2'
            disabled={!canSubmit || updateTeacherMutation.isPending}
          >
            {updateTeacherMutation.isPending || isSubmitting
              ? 'Updating...'
              : 'Save Changes'}
          </Button>
        )}
      </form.Subscribe>
    </form>
  );
}
