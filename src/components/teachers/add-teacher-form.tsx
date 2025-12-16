'use client';

import { Button } from '@/components/ui/button';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useCreateTeacher } from '@/hooks/use-teachers';
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

const teacherSchema = z.object({
  name: z.string().min(1, 'Name is required e.g. "John Doe"'),
  email: z.email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  title: z.string(),
  joinDate: z.string(),
});

interface AddTeacherFormProps {
  onSuccess?: () => void;
}

export function AddTeacherForm({ onSuccess }: AddTeacherFormProps) {
  const createTeacherMutation = useCreateTeacher();
  const [globalError, setGlobalError] = useState<string>('');

  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      title: '',
      joinDate: new Date().toISOString().split('T')[0], // Default to today
    },
    validators: {
      onChange: teacherSchema,
    },
    onSubmit: async ({ value }) => {
      setGlobalError('');
      try {
        await createTeacherMutation.mutateAsync({
          name: value.name,
          email: value.email,
          password: value.password,
          title: value.title || undefined,
          joinDate: value.joinDate || undefined,
        });
        toast.success('Teacher added successfully');
        form.reset();
        onSuccess?.();
      } catch (error) {
        setGlobalError(
          error instanceof Error ? error.message : 'Failed to create teacher'
        );
        toast.error('Failed to add teacher');
      }
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

        <form.Field name='email'>
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && field.state.meta.errors.length > 0;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Email Address</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder='e.g. teacher@school.com'
                  type='email'
                  aria-invalid={isInvalid}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        <form.Field name='password'>
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && field.state.meta.errors.length > 0;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder='••••••••'
                  type='password'
                  aria-invalid={isInvalid}
                />
                <p className='text-xs text-muted-foreground mt-1'>
                  Must be at least 6 characters.
                </p>
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
                          !field.state.value && 'text-muted-foreground'
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
                          date ? format(date, 'yyyy-MM-dd') : ''
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

      {globalError && (
        <div className='text-sm text-red-500 bg-red-50 border border-red-200 rounded-md p-3'>
          {globalError}
        </div>
      )}

      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
      >
        {([canSubmit, isSubmitting]) => (
          <Button
            type='submit'
            className='w-full mt-2'
            disabled={!canSubmit || createTeacherMutation.isPending}
          >
            {createTeacherMutation.isPending || isSubmitting
              ? 'Adding Teacher...'
              : 'Add Teacher'}
          </Button>
        )}
      </form.Subscribe>
    </form>
  );
}
