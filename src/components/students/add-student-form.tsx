'use client';

import { Button } from '@/components/ui/button';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useCreateStudent } from '@/hooks/use-students';
import { useForm } from '@tanstack/react-form';
import { useState } from 'react';
import { z } from 'zod';
import { toast } from 'sonner';

const studentSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long'),
  email: z.email('Please provide a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  studentId: z.string(),
});

interface AddStudentFormProps {
  onSuccess?: () => void;
}

export function AddStudentForm({ onSuccess }: AddStudentFormProps) {
  const createStudentMutation = useCreateStudent();

  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      studentId: '',
    },
    validators: {
      onChange: studentSchema,
    },
    onSubmit: async ({ value }) => {
      await createStudentMutation.mutateAsync({
        name: value.name,
        email: value.email,
        password: value.password,
        studentId: value.studentId || undefined,
      });
      toast.success('Student added successfully');
      form.reset();
      onSuccess?.();
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
                  placeholder='e.g. Jane Doe'
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
                  placeholder='e.g. student@school.com'
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
                  Must be at least 8 characters.
                </p>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        <form.Field name='studentId'>
          {(field) => {
            return (
              <Field>
                <FieldLabel htmlFor={field.name}>
                  Student ID (Optional)
                </FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder='e.g. STU12345'
                />
              </Field>
            );
          }}
        </form.Field>
      </FieldGroup>

      {createStudentMutation.error && (
        <div className='text-sm text-red-500 bg-red-50 border border-red-200 rounded-md p-3'>
          {createStudentMutation.error.response?.data?.message ||
            createStudentMutation.error.message ||
            'Failed to create student'}
        </div>
      )}

      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
      >
        {([canSubmit, isSubmitting]) => (
          <Button
            type='submit'
            className='w-full mt-2'
            disabled={!canSubmit || createStudentMutation.isPending}
          >
            {createStudentMutation.isPending || isSubmitting
              ? 'Adding Student...'
              : 'Add Student'}
          </Button>
        )}
      </form.Subscribe>
    </form>
  );
}
