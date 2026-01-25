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
import { useCreateClassroom } from '@/hooks/use-classrooms';
import { useForm } from '@tanstack/react-form';
import z from 'zod';
import { CourseSelect } from './course-select';

const classroomSchema = z.object({
  courseId: z.string().min(1, 'Course is required'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  section: z.string().min(1, 'Section is required'),
  description: z.string().optional(),
});

interface CreateClassroomFormProps {
  onSuccess?: () => void;
}

export function CreateClassroomForm({ onSuccess }: CreateClassroomFormProps) {
  const createClassroomMutation = useCreateClassroom();

  const form = useForm({
    defaultValues: {
      courseId: '',
      name: '',
      section: '',
      description: '',
    },
    validators: {
      onChange: classroomSchema,
    },
    onSubmit: async ({ value }) => {
      await createClassroomMutation.mutateAsync({
        courseId: value.courseId,
        name: value.name,
        section: value.section,
        description: value.description,
      });
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
        <form.Field name='courseId'>
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && field.state.meta.errors.length > 0;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Course</FieldLabel>
                <CourseSelect
                  value={field.state.value}
                  onValueChange={(val) => field.handleChange(val || '')}
                  error={isInvalid}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        <form.Field name='name'>
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && field.state.meta.errors.length > 0;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Class Name</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder='e.g. Data Structures and Algorithms'
                  aria-invalid={isInvalid}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        <form.Field name='section'>
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && field.state.meta.errors.length > 0;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Section</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder='e.g. CSE-301-A'
                  aria-invalid={isInvalid}
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
                  placeholder='Enter a brief description...'
                  rows={3}
                />
              </Field>
            );
          }}
        </form.Field>
      </FieldGroup>

      {createClassroomMutation.error && (
        <div className='text-sm text-red-500 bg-red-50 border border-red-200 rounded-md p-3'>
          {createClassroomMutation.error.response?.data?.message ||
            createClassroomMutation.error.message ||
            'Failed to create classroom'}
        </div>
      )}

      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
      >
        {([canSubmit, isSubmitting]) => (
          <Button
            type='submit'
            className='w-full mt-2'
            disabled={!canSubmit || createClassroomMutation.isPending}
          >
            {createClassroomMutation.isPending || isSubmitting
              ? 'Creating Classroom...'
              : 'Create Classroom'}
          </Button>
        )}
      </form.Subscribe>
    </form>
  );
}
