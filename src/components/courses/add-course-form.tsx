"use client";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCreateCourse } from "@/hooks/use-courses";
import { useFormErrorHandler } from "@/hooks/use-form-handler";
import { useForm } from "@tanstack/react-form";
import { courseSchema, type CourseFormValues } from "@/lib/schemas/course-schema";
import { TeacherSelect } from "./teacher-select";
import { SemesterSelect } from "./semester-select";
import { SessionSelect } from "./session-select";

interface AddCourseFormProps {
  onSuccess?: () => void;
}

export function AddCourseForm({ onSuccess }: AddCourseFormProps) {
  const createCourseMutation = useCreateCourse();
  const { fieldErrors, globalErrors, handleError } = useFormErrorHandler();

  const form = useForm({
    defaultValues: {
      title: "",
      code: "",
      description: "",
      credits: 3,
      semesterId: undefined,
      sessionId: undefined,
      maxStudents: 50,
      teacherId: "",
    } as CourseFormValues,
    validators: {
      onSubmit: courseSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await createCourseMutation.mutateAsync({
          title: value.title,
          code: value.code,
          description: value.description || undefined,
          credits: value.credits,
          semesterId: value.semesterId,
          sessionId: value.sessionId || undefined,
          maxStudents: value.maxStudents,
          teacherId: value.teacherId || undefined,
        });
        form.reset();
        onSuccess?.();
      } catch (error: any) {
        handleError(error, value);
      }
    },
  });

  const getFieldError = (fieldName: string, fieldErrorsState: any[]) => {
    if (fieldErrorsState.length > 0) return fieldErrorsState;
    if (fieldErrors[fieldName]) return [{ message: fieldErrors[fieldName] }];
    return [];
  };

  return (
    <form
      id="add-course-form"
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="flex flex-col gap-6"
    >
      <FieldGroup>
        <div className="grid gap-4 sm:grid-cols-4">
          <form.Field
            name="title"
            children={(field) => {
              const errors = getFieldError(field.name, field.state.meta.errors);
              const isInvalid = errors.length > 0;
              return (
                <Field data-invalid={isInvalid} className="sm:col-span-3">
                  <FieldLabel htmlFor={field.name}>
                    Course Title <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="e.g. Introduction to Computer Science"
                    aria-invalid={isInvalid}
                  />
                  {isInvalid && <FieldError errors={errors} />}
                </Field>
              );
            }}
          />

          <form.Field
            name="code"
            children={(field) => {
              const errors = getFieldError(field.name, field.state.meta.errors);
              const isInvalid = errors.length > 0;
              return (
                <Field data-invalid={isInvalid} className="sm:col-span-1">
                  <FieldLabel htmlFor={field.name}>
                    Code <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="CS101"
                    aria-invalid={isInvalid}
                  />
                  {isInvalid && <FieldError errors={errors} />}
                </Field>
              );
            }}
          />

          <form.Field
            name="semesterId"
            children={(field) => {
              const errors = getFieldError(field.name, field.state.meta.errors);
              const isInvalid = errors.length > 0;
              return (
                <Field data-invalid={isInvalid} className="sm:col-span-2">
                  <FieldLabel htmlFor={field.name}>Semester</FieldLabel>
                  <SemesterSelect
                    value={field.state.value}
                    onValueChange={field.handleChange}
                    error={isInvalid}
                  />
                  {isInvalid && <FieldError errors={errors} />}
                </Field>
              );
            }}
          />

          <form.Field
            name="sessionId"
            children={(field) => {
              const errors = getFieldError(field.name, field.state.meta.errors);
              const isInvalid = errors.length > 0;
              return (
                <Field data-invalid={isInvalid} className="sm:col-span-2">
                  <FieldLabel htmlFor={field.name}>Session</FieldLabel>
                  <SessionSelect
                    value={field.state.value}
                    onValueChange={field.handleChange}
                    error={isInvalid}
                  />
                  {isInvalid && <FieldError errors={errors} />}
                </Field>
              );
            }}
          />

          <form.Field
            name="credits"
            children={(field) => {
              const errors = getFieldError(field.name, field.state.meta.errors);
              const isInvalid = errors.length > 0;
              return (
                <Field data-invalid={isInvalid} className="sm:col-span-1">
                  <FieldLabel htmlFor={field.name}>
                    Credits <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="number"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(Number(e.target.value))}
                    placeholder="3"
                    aria-invalid={isInvalid}
                  />
                  {isInvalid && <FieldError errors={errors} />}
                </Field>
              );
            }}
          />

          <form.Field
            name="maxStudents"
            children={(field) => {
              const errors = getFieldError(field.name, field.state.meta.errors);
              const isInvalid = errors.length > 0;
              return (
                <Field data-invalid={isInvalid} className="sm:col-span-1">
                  <FieldLabel htmlFor={field.name}>
                    Capacity <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="number"
                    value={field.state.value ?? ""}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(Number(e.target.value))}
                    placeholder="50"
                    aria-invalid={isInvalid}
                  />
                  {isInvalid && <FieldError errors={errors} />}
                </Field>
              );
            }}
          />

          <form.Field
            name="teacherId"
            children={(field) => {
              const errors = getFieldError(field.name, field.state.meta.errors);
              const isInvalid = errors.length > 0;
              return (
                <Field data-invalid={isInvalid} className="sm:col-span-4">
                  <FieldLabel htmlFor={field.name}>Assign Teacher</FieldLabel>
                  <TeacherSelect
                    value={field.state.value}
                    onValueChange={field.handleChange}
                    error={isInvalid}
                  />
                  {isInvalid && <FieldError errors={errors} />}
                </Field>
              );
            }}
          />

          <form.Field
            name="description"
            children={(field) => {
              return (
                <Field className="sm:col-span-4">
                  <FieldLabel htmlFor={field.name}>Description</FieldLabel>
                  <Textarea
                    id={field.name}
                    name={field.name}
                    value={field.state.value ?? ""}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Brief description of the course"
                    className="min-h-[80px]"
                  />
                </Field>
              );
            }}
          />
        </div>

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
          children={([canSubmit, isSubmitting]) => (
            <div className="flex items-center justify-end gap-3 mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
                disabled={isSubmitting}
              >
                Reset
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="min-w-[120px]"
              >
                {isSubmitting ? "Creating..." : "Create Course"}
              </Button>
            </div>
          )}
        />
      </FieldGroup>
    </form>
  );
}
