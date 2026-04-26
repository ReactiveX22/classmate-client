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
import { useUpdateStudent } from '@/hooks/use-students';
import { StudentData } from '@/lib/api/services/student.service';
import { useFormErrorHandler } from '@/hooks/use-form-handler';
import { useForm } from '@tanstack/react-form';
import { editStudentSchema, type EditStudentFormValues } from '@/lib/schemas/student-schema';

interface EditStudentFormProps {
  student: StudentData;
  onSuccess?: () => void;
}

export function EditStudentForm({ student, onSuccess }: EditStudentFormProps) {
  const updateStudentMutation = useUpdateStudent();
  const { fieldErrors, globalErrors, handleError } = useFormErrorHandler();

  const form = useForm({
    defaultValues: {
      name: student.user.name || '',
      studentId: student.student?.studentId || '',
      phone: student.userProfile?.phone || '',
    } as EditStudentFormValues,
    validators: {
      onSubmit: editStudentSchema,
    },
    onSubmit: async ({ value }) => {
      if (!student.user?.id) {
        return;
      }

      try {
        await updateStudentMutation.mutateAsync({
          id: student.user.id,
          data: {
            name: value.name,
            studentId: value.studentId || undefined,
            phone: value.phone || undefined,
          },
        });
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
                  placeholder='e.g. John Doe'
                  aria-invalid={isInvalid}
                />
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
                  value={field.state.value || ''}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder='e.g. ST-2023-001'
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
                  value={field.state.value}
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
              {isSubmitting ? 'Updating...' : 'Save Changes'}
            </Button>
          </div>
        )}
      </form.Subscribe>
    </form>
  );
}
