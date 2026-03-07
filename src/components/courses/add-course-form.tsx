'use client';

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
  credits: z.number().min(1, 'Credits must be at least 1'),
  semester: z.string().min(4, 'Semester must be at least 4 characters long'),
  maxStudents: z.number().min(1, 'Must be at least 1 student'),
  teacherId: z.string().or(z.literal('')),
});

interface AddCourseFormProps {
  onSuccess?: () => void;
  formId?: string;
  onSubmittingChange?: (isSubmitting: boolean) => void;
}

export function AddCourseForm({
  onSuccess,
  formId = 'add-course-form',
  onSubmittingChange,
}: AddCourseFormProps) {
  const createCourseMutation = useCreateCourse();

  const form = useForm({
    defaultValues: {
      title: '',
      code: '',
      description: '',
      credits: 3,
      semester: '',
      maxStudents: 50,
      teacherId: '',
    },
    validators: {
      onChange: courseSchema,
    },
    onSubmit: async ({ value }) => {
      onSubmittingChange?.(true);
      try {
        await createCourseMutation.mutateAsync({
          title: value.title,
          code: value.code,
          description: value.description || undefined,
          credits: value.credits,
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
            toast.error(`Validation Error: ${err.field}`, {
              description: err.issue,
            });
          });
        }
      } finally {
        onSubmittingChange?.(false);
      }
    },
  });

  return (
    <form
      id={formId}
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className='flex flex-col gap-4'
    >
      <div className='grid gap-4 sm:grid-cols-4'>
        <form.Field name='title'>
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && field.state.meta.errors.length > 0;
            return (
              <Field data-invalid={isInvalid} className='sm:col-span-3'>
                <FieldLabel htmlFor={field.name}>Course Title</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder='e.g. Introduction to Computer Science'
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
              <Field data-invalid={isInvalid} className='sm:col-span-1'>
                <FieldLabel htmlFor={field.name}>Code</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder='CS101'
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        <form.Field name='semester'>
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && field.state.meta.errors.length > 0;
            return (
              <Field data-invalid={isInvalid} className='sm:col-span-2'>
                <FieldLabel htmlFor={field.name}>Semester</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder='e.g. Fall 2024 - Sem 1'
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        <form.Field name='credits'>
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && field.state.meta.errors.length > 0;
            return (
              <Field data-invalid={isInvalid} className='sm:col-span-1'>
                <FieldLabel htmlFor={field.name}>Credits</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  type='number'
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(Number(e.target.value))}
                  placeholder='3'
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        <form.Field name='maxStudents'>
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && field.state.meta.errors.length > 0;
            return (
              <Field data-invalid={isInvalid} className='sm:col-span-1'>
                <FieldLabel htmlFor={field.name}>Capacity</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  type='number'
                  value={field.state.value ?? ''}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(Number(e.target.value))}
                  placeholder='50'
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
              <Field data-invalid={isInvalid} className='sm:col-span-4'>
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
              <Field className='sm:col-span-4'>
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
                  className='min-h-[80px]'
                />
              </Field>
            );
          }}
        </form.Field>
      </div>

      {createCourseMutation.error &&
        !createCourseMutation.error.response?.data?.errors && (
          <div className='text-sm text-red-500 bg-red-50 border border-red-200 rounded-md p-3 mt-2'>
            {createCourseMutation.error.response?.data?.message ||
              createCourseMutation.error.message ||
              'Failed to create course'}
          </div>
        )}
    </form>
  );
}
