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
import { useUpdateStudent } from '@/hooks/use-students';
import { StudentData } from '@/lib/api/services/student.service';
import { useForm } from '@tanstack/react-form';
import { z } from 'zod';

const editStudentSchema = z.object({
  name: z.string().min(1, 'Name is required e.g. "John Doe"'),
  studentId: z.string(),
  status: z.enum(['active', 'pending', 'suspended'] as const),
});

interface EditStudentFormProps {
  student: StudentData;
  onSuccess?: () => void;
}

export function EditStudentForm({ student, onSuccess }: EditStudentFormProps) {
  const updateStudentMutation = useUpdateStudent();

  const form = useForm({
    defaultValues: {
      name: student.user.name || '',
      studentId: student.student?.studentId || '',
      status: (student.user.status as any) || 'active',
    },
    validators: {
      onChange: editStudentSchema,
    },
    onSubmit: async ({ value }) => {
      // Ensure student.student.id exists. If not, we can't update.
      // Assuming all listed students have a student record.
      if (!student.student?.id) {
        return;
      }

      await updateStudentMutation.mutateAsync(
        {
          id: student.student.id,
          data: {
            name: value.name,
            studentId: value.studentId || undefined,
            status: value.status,
          },
        },
        {
          onSuccess: () => {
            onSuccess?.();
          },
        }
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
                  value={field.state.value || ''}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder='e.g. ST-2023-001'
                />
              </Field>
            );
          }}
        </form.Field>

        <form.Field name='status'>
          {(field) => (
            <Field>
              <FieldLabel htmlFor={field.name}>Status</FieldLabel>
              <Select
                value={field.state.value}
                onValueChange={(value) => field.handleChange(value as any)}
              >
                <SelectTrigger>
                  <SelectValue className='capitalize' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='active'>Active</SelectItem>
                  <SelectItem value='pending'>Pending</SelectItem>
                  <SelectItem value='suspended'>Suspended</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          )}
        </form.Field>
      </FieldGroup>

      {updateStudentMutation.error && (
        <div className='text-sm text-red-500 bg-red-50 border border-red-200 rounded-md p-3'>
          {updateStudentMutation.error.response?.data?.message ||
            updateStudentMutation.error.message ||
            'Failed to update student'}
        </div>
      )}

      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
      >
        {([canSubmit, isSubmitting]) => (
          <Button
            type='submit'
            className='w-full mt-2'
            disabled={!canSubmit || updateStudentMutation.isPending}
          >
            {updateStudentMutation.isPending || isSubmitting
              ? 'Updating...'
              : 'Save Changes'}
          </Button>
        )}
      </form.Subscribe>
    </form>
  );
}
