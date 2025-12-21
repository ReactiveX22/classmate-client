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
import { useUpdateCourse } from '@/hooks/use-courses';
import { Course } from '@/lib/api/services/course.service';
import { useForm } from '@tanstack/react-form';
import { z } from 'zod';
import { ErrorCode } from '@/types/errors';
import { toast } from 'sonner';
import { TeacherSelect } from './teacher-select';

const editCourseSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters long'),
  code: z.string().min(2, 'Course code must be at least 2 characters long'),
  description: z.string(),
  credits: z.number().min(1, 'Credits must be at least 1'),
  semester: z.string().min(4, 'Semester must be at least 4 characters long'),
  maxStudents: z.number().min(1, 'Must be at least 1 student'),
  teacherId: z.string().uuid('Invalid teacher ID').or(z.literal('')),
});

interface EditCourseFormProps {
  course: Course;
  onSuccess?: () => void;
}

export function EditCourseForm({ course, onSuccess }: EditCourseFormProps) {
  const updateCourseMutation = useUpdateCourse();

  const form = useForm({
    defaultValues: {
      title: course.title,
      code: course.code,
      description: course.description || '',
      credits: course.credits,
      semester: course.semester,
      maxStudents: course.maxStudents,
      teacherId: course.teacherId || '',
    },
    validators: {
      onChange: editCourseSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await updateCourseMutation.mutateAsync(
          {
            id: course.id,
            data: {
              title: value.title,
              code: value.code,
              description: value.description || undefined,
              credits: value.credits,
              semester: value.semester,
              maxStudents: value.maxStudents,
              teacherId: value.teacherId || undefined,
            },
          },
          {
            onSuccess: () => {
              onSuccess?.();
            },
          }
        );
      } catch (error: any) {
        const apiError = error.response?.data;
        if (
          apiError?.errorCode === ErrorCode.VALIDATION_FAILED &&
          apiError.errors
        ) {
          apiError.errors.forEach((err: any) => {
            toast.error(`Validation Error: ${err.field}`, {
              description: err.issue,
            });
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
                  placeholder='e.g. Introduction to Physics'
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
                  placeholder='e.g. PHY101'
                  aria-invalid={isInvalid}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        <div className='grid grid-cols-2 gap-4'>
          <form.Field name='credits'>
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
                  placeholder='Brief description'
                  className='min-h-[100px]'
                />
              </Field>
            );
          }}
        </form.Field>
      </FieldGroup>

      {updateCourseMutation.error &&
        !updateCourseMutation.error.response?.data?.errors && (
          <div className='text-sm text-red-500 bg-red-50 border border-red-200 rounded-md p-3'>
            {updateCourseMutation.error.response?.data?.message ||
              updateCourseMutation.error.message ||
              'Failed to update course'}
          </div>
        )}

      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
      >
        {([canSubmit, isSubmitting]) => (
          <Button
            type='submit'
            className='w-full mt-2'
            disabled={!canSubmit || updateCourseMutation.isPending}
          >
            {updateCourseMutation.isPending || isSubmitting
              ? 'Updating...'
              : 'Save Changes'}
          </Button>
        )}
      </form.Subscribe>
    </form>
  );
}
