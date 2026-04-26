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
import { Checkbox } from '@/components/ui/checkbox';
import { useCreateCourseSession } from '@/hooks/use-course-sessions';
import { useForm, type ValidationError } from '@tanstack/react-form';
import { courseSessionSchema, type CourseSessionFormValues } from '@/lib/schemas/course-session-schema';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useFormErrorHandler } from '@/hooks/use-form-handler';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface AddCourseSessionFormProps {
  onSuccess?: () => void;
}

export function AddCourseSessionForm({ onSuccess }: AddCourseSessionFormProps) {
  const createSessionMutation = useCreateCourseSession();
  const { fieldErrors, globalErrors, handleError } = useFormErrorHandler();

  const form = useForm({
    defaultValues: {
      name: '',
      description: '',
      startDate: '',
      endDate: '',
      isCurrent: false,
    } as CourseSessionFormValues,
    validators: {
      onSubmit: courseSessionSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await createSessionMutation.mutateAsync({
          name: value.name,
          description: value.description || undefined,
          startDate: value.startDate || undefined,
          endDate: value.endDate || undefined,
          isCurrent: value.isCurrent,
        });
        onSuccess?.();
      } catch (error) {
        handleError(error, value);
      }
    },
  });

  const getFieldError = (fieldName: string, fieldErrorsState: ValidationError[]) => {
    if (fieldErrorsState.length > 0) return fieldErrorsState;
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
                <FieldLabel htmlFor={field.name}>Session Name <span className='text-destructive'>*</span></FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder='e.g. Spring 2025'
                  aria-invalid={isInvalid}
                />
                {isInvalid && <FieldError errors={errors} />}
              </Field>
            );
          }}
        </form.Field>

        <form.Field name='description'>
          {(field) => (
            <Field>
              <FieldLabel htmlFor={field.name}>Description</FieldLabel>
              <Textarea
                id={field.name}
                name={field.name}
                value={field.state.value ?? ''}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder='Brief description of the session'
              />
            </Field>
          )}
        </form.Field>

        <div className='grid grid-cols-2 gap-4'>
          <form.Field name='startDate'>
            {(field) => (
              <Field className='flex flex-col'>
                <FieldLabel htmlFor={field.name}>Start Date</FieldLabel>
                <Popover>
                  <PopoverTrigger
                    render={
                      <Button
                        type='button'
                        variant={'outline'}
                        className={cn(
                          'w-full pl-3 text-left font-normal',
                          !field.state.value && 'text-muted-foreground',
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
                      selected={field.state.value ? new Date(field.state.value) : undefined}
                      onSelect={(date) => {
                        field.handleChange(date ? format(date, 'yyyy-MM-dd') : '');
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </Field>
            )}
          </form.Field>

          <form.Field name='endDate'>
            {(field) => (
              <Field className='flex flex-col'>
                <FieldLabel htmlFor={field.name}>End Date</FieldLabel>
                <Popover>
                  <PopoverTrigger
                    render={
                      <Button
                        type='button'
                        variant={'outline'}
                        className={cn(
                          'w-full pl-3 text-left font-normal',
                          !field.state.value && 'text-muted-foreground',
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
                      selected={field.state.value ? new Date(field.state.value) : undefined}
                      onSelect={(date) => {
                        field.handleChange(date ? format(date, 'yyyy-MM-dd') : '');
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </Field>
            )}
          </form.Field>
        </div>

        <form.Field name='isCurrent'>
          {(field) => (
            <div className='flex items-center space-x-2 py-2'>
              <Checkbox
                id={field.name}
                checked={field.state.value}
                onCheckedChange={(checked) => field.handleChange(!!checked)}
              />
              <FieldLabel htmlFor={field.name} className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
                Set as Current Session
              </FieldLabel>
            </div>
          )}
        </form.Field>
      </FieldGroup>

      {globalErrors.length > 0 && (
        <Alert variant="destructive" className="mt-4">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {globalErrors.map((err, i) => (
              <p key={i}>{err.message}</p>
            ))}
          </AlertDescription>
        </Alert>
      )}

      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
      >
        {([, isSubmitting]) => (
          <Button
            type='submit'
            className='w-full mt-2'
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create Session'}
          </Button>
        )}
      </form.Subscribe>
    </form>
  );
}
