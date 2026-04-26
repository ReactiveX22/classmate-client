'use client';

import { Button } from '@/components/ui/button';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { useCreateStudent } from '@/hooks/use-students';
import { useFormErrorHandler } from '@/hooks/use-form-handler';
import { useForm } from '@tanstack/react-form';
import { studentSchema, type StudentFormValues } from '@/lib/schemas/student-schema';

interface AddStudentFormProps {
  onSuccess?: () => void;
}

export function AddStudentForm({ onSuccess }: AddStudentFormProps) {
  const createStudentMutation = useCreateStudent();
  const { fieldErrors, globalErrors, handleError } = useFormErrorHandler();

  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      studentId: '',
      phone: '',
    } as StudentFormValues,
    validators: {
      onSubmit: studentSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await createStudentMutation.mutateAsync({
          name: value.name,
          email: value.email,
          password: value.password,
          studentId: value.studentId || undefined,
          phone: value.phone || undefined,
        });
        form.reset();
        onSuccess?.();
      } catch (error: unknown) {
        handleError(error, value);
      }
    },
  });

  const getFieldError = (fieldName: string, fieldErrorsState: unknown[]) => {
    if (fieldErrorsState.length > 0) return fieldErrorsState as { message: string }[];
    if (fieldErrors[fieldName]) return [{ message: fieldErrors[fieldName] }];
    return [];
  };

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
            const errors = getFieldError(field.name, field.state.meta.errors);
            const isInvalid = errors.length > 0;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>
                  Full Name <span className='text-destructive'>*</span>
                </FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder='e.g. Jane Doe'
                  aria-invalid={isInvalid}
                />
                {isInvalid && <FieldError errors={errors} />}
              </Field>
            );
          }}
        </form.Field>

        <form.Field name='email'>
          {(field) => {
            const errors = getFieldError(field.name, field.state.meta.errors);
            const isInvalid = errors.length > 0;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>
                  Email Address <span className='text-destructive'>*</span>
                </FieldLabel>
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
                {isInvalid && <FieldError errors={errors} />}
              </Field>
            );
          }}
        </form.Field>

        <form.Field name='password'>
          {(field) => {
            const errors = getFieldError(field.name, field.state.meta.errors);
            const isInvalid = errors.length > 0;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>
                  Password <span className='text-destructive'>*</span>
                </FieldLabel>
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
                {isInvalid && <FieldError errors={errors} />}
              </Field>
            );
          }}
        </form.Field>

        <form.Field name='studentId'>
          {(field) => {
            const errors = getFieldError(field.name, field.state.meta.errors);
            const isInvalid = errors.length > 0;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>
                  Student ID (Optional)
                </FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value ?? ''}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder='e.g. STU12345'
                  aria-invalid={isInvalid}
                />
                {isInvalid && <FieldError errors={errors} />}
              </Field>
            );
          }}
        </form.Field>

        <form.Field name='phone'>
          {(field) => {
            const errors = getFieldError(field.name, field.state.meta.errors);
            const isInvalid = errors.length > 0;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>
                  Phone (Optional)
                </FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value ?? ''}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder='e.g. +1 (555) 123-4567'
                  aria-invalid={isInvalid}
                />
                {isInvalid && <FieldError errors={errors} />}
              </Field>
            );
          }}
        </form.Field>
      </FieldGroup>

      {globalErrors.length > 0 && (
        <Alert variant='destructive' className='mt-4'>
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {globalErrors.map((err, i) => (
              <p key={i}>{err.message}</p>
            ))}
          </AlertDescription>
        </Alert>
      )}

      <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
        {([, isSubmitting]) => (
          <div className='flex items-center justify-end gap-3 mt-4'>
            <Button
              type='button'
              variant='outline'
              onClick={() => form.reset()}
              disabled={isSubmitting}
            >
              Reset
            </Button>
            <Button
              type='submit'
              disabled={isSubmitting}
              className='min-w-[120px]'
            >
              {isSubmitting ? 'Adding...' : 'Add Student'}
            </Button>
          </div>
        )}
      </form.Subscribe>
    </form>
  );
}
