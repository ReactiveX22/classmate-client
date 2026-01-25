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
import { useUpdateClassroom } from '@/hooks/use-classrooms';
import { ClassroomDetail } from '@/lib/api/services/classroom.service';
import { useForm } from '@tanstack/react-form';
import z from 'zod';
import { CourseSelect } from '../../course-select';

const classroomSchema = z.object({
  courseId: z.string().min(1, 'Course is required'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  section: z.string().min(1, 'Section is required'),
  description: z.string(),
});

interface UpdateClassroomFormProps {
  classroom: ClassroomDetail;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function UpdateClassroomForm({
  classroom,
  onSuccess,
  onCancel,
}: UpdateClassroomFormProps) {
  const updateClassroomMutation = useUpdateClassroom();

  const form = useForm({
    defaultValues: {
      courseId: classroom.course.id,
      name: classroom.name,
      section: classroom.section,
      description: classroom.description || '',
    },
    validators: {
      onChange: classroomSchema,
    },
    onSubmit: async ({ value }) => {
      await updateClassroomMutation.mutateAsync({
        id: classroom.id,
        data: {
          courseId: value.courseId,
          name: value.name,
          section: value.section,
          description: value.description,
        },
      });
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
      className='flex flex-col gap-4'
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

      {updateClassroomMutation.error && (
        <div className='text-sm text-red-500 bg-red-50 border border-red-200 rounded-md p-3'>
          {updateClassroomMutation.error.response?.data?.message ||
            updateClassroomMutation.error.message ||
            'Failed to update classroom'}
        </div>
      )}

      <div className='flex items-center gap-2 justify-end'>
        <Button
          type='button'
          variant='ghost'
          onClick={onCancel}
          disabled={updateClassroomMutation.isPending}
        >
          Cancel
        </Button>
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
        >
          {([canSubmit, isSubmitting]) => (
            <Button
              type='submit'
              disabled={!canSubmit || updateClassroomMutation.isPending}
            >
              {updateClassroomMutation.isPending || isSubmitting
                ? 'Saving...'
                : 'Save Changes'}
            </Button>
          )}
        </form.Subscribe>
      </div>
    </form>
  );
}
