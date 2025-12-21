'use client';

import { Button } from '@/components/ui/button';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useCreateCourse } from '@/hooks/use-courses';
import { useForm } from '@tanstack/react-form';
import { z } from 'zod';
import { toast } from 'sonner';
import { TeacherSelect } from './teacher-select';
import { ErrorCode } from '@/types/errors';

const courseSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters long'),
  code: z.string().min(2, 'Course code must be at least 2 characters long'),
  description: z.string(),
  credit: z.number().min(1, 'Credit must be at least 1'),
  semester: z.string().min(4, 'Semester must be at least 4 characters long'),
  maxStudents: z.number().min(1, 'Must be at least 1 student'),
  teacherId: z.string().uuid('Invalid teacher ID').or(z.literal('')),
});

interface AddCourseFormProps {
  onSuccess?: () => void;
}

export function AddCourseForm({ onSuccess }: AddCourseFormProps) {
  const createCourseMutation = useCreateCourse();

  const form = useForm({
    defaultValues: {
      title: '',
      code: '',
      description: '',
      credit: 3,
      semester: '',
      maxStudents: 50,
      teacherId: '',
    },
    validators: {
      onChange: courseSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await createCourseMutation.mutateAsync({
          title: value.title,
          code: value.code,
          description: value.description || undefined,
          credit: value.credit,
          semester: value.semester,
          maxStudents: value.maxStudents,
          teacherId: value.teacherId || undefined,
        });
        form.reset();
        onSuccess?.();
      } catch (error: any) {
        const apiError = error.response?.data;
        if (
          apiError?.errorCode === ErrorCode.VALIDATION_FAILED &&
          apiError.errors
        ) {
          apiError.errors.forEach((err: any) => {
            // Map backend validation errors to form fields if possible
            // This is a simplified mapping
            toast.error(`Validation Error: ${err.field}`, {
              description: err.issue,
            });
          });
        } else if (apiError?.errorCode === ErrorCode.TEACHER_NOT_FOUND_IN_ORG) {
          toast.error('Teacher Error', {
            description: apiError.message,
          });
        }
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
        <form.Field name='title'>
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && field.state.meta.errors.length > 0;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Course Title</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder='e.g. Introduction to Computer Science'
                  aria-invalid={isInvalid}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        <form.Field name='code'>
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && field.state.meta.errors.length > 0;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Course Code</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder='e.g. CS101'
                  aria-invalid={isInvalid}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        <div className='grid grid-cols-2 gap-4'>
          <form.Field name='credit'>
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched &&
                field.state.meta.errors.length > 0;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Credits</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    type='number'
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(Number(e.target.value))}
                    placeholder='3'
                    aria-invalid={isInvalid}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>

          <form.Field name='maxStudents'>
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched &&
                field.state.meta.errors.length > 0;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Max Students</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    type='number'
                    value={field.state.value ?? ''}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(Number(e.target.value))}
                    placeholder='50'
                    aria-invalid={isInvalid}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>
        </div>

        <form.Field name='semester'>
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && field.state.meta.errors.length > 0;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Semester</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder='e.g. Fall 2024 - Sem 1'
                  aria-invalid={isInvalid}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        <form.Field name='teacherId'>
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && field.state.meta.errors.length > 0;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>
                  Assign Teacher (Optional)
                </FieldLabel>
                <TeacherSelect
                  value={field.state.value}
                  onValueChange={(val) => field.handleChange(val || '')}
                  error={isInvalid}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        <form.Field name='description'>
          {(field) => {
            return (
              <Field>
                <FieldLabel htmlFor={field.name}>
                  Description (Optional)
                </FieldLabel>
                <Textarea
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder='Brief description of the course'
                  className='min-h-[100px]'
                />
              </Field>
            );
          }}
        </form.Field>
      </FieldGroup>

      {createCourseMutation.error &&
        !createCourseMutation.error.response?.data?.errors && (
          <div className='text-sm text-red-500 bg-red-50 border border-red-200 rounded-md p-3'>
            {createCourseMutation.error.response?.data?.message ||
              createCourseMutation.error.message ||
              'Failed to create course'}
          </div>
        )}

      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
      >
        {([canSubmit, isSubmitting]) => (
          <Button
            type='submit'
            className='w-full mt-2'
            disabled={!canSubmit || createCourseMutation.isPending}
          >
            {createCourseMutation.isPending || isSubmitting
              ? 'Adding Course...'
              : 'Add Course'}
          </Button>
        )}
      </form.Subscribe>
    </form>
  );
}
