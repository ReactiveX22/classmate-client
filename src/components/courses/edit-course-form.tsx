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
import { useUpdateCourse } from "@/hooks/use-courses";
import { useFormErrorHandler } from "@/hooks/use-form-handler";
import { Course } from "@/lib/api/services/course.service";
import { useForm } from "@tanstack/react-form";
import {
  courseSchema,
  type CourseFormValues,
} from "@/lib/schemas/course-schema";
import { TeacherSelect } from "./teacher-select";
import { SemesterSelect } from "./semester-select";
import { SessionSelect } from "./session-select";

interface EditCourseFormProps {
  course: Course;
  onSuccess?: () => void;
}

export function EditCourseForm({ course, onSuccess }: EditCourseFormProps) {
  const updateCourseMutation = useUpdateCourse();
  const { fieldErrors, globalErrors, handleError } = useFormErrorHandler();

  const form = useForm({
    defaultValues: {
      title: course.title,
      code: course.code,
      description: course.description || "",
      credits: course.credits,
      semesterId: course.semesterId || undefined,
      sessionId: course.sessionId || undefined,
      maxStudents: course.maxStudents,
      teacherId: course.teacherId || "",
    } as CourseFormValues,
    validators: {
      onSubmit: courseSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await updateCourseMutation.mutateAsync({
          id: course.id,
          data: {
            title: value.title,
            code: value.code,
            description: value.description || undefined,
            credits: value.credits,
            semesterId: value.semesterId || undefined,
            sessionId: value.sessionId || undefined,
            maxStudents: value.maxStudents,
            teacherId: value.teacherId || undefined,
          },
        });
        onSuccess?.();
      } catch (error: unknown) {
        handleError(error, value);
      }
    },
  });

  const getFieldError = (fieldName: string, fieldErrorsState: unknown[]) => {
    if (fieldErrorsState.length > 0)
      return fieldErrorsState as { message: string }[];
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
      className="flex flex-col gap-4 p-1"
    >
      <FieldGroup>
        <form.Field name="title">
          {(field) => {
            const errors = getFieldError(field.name, field.state.meta.errors);
            const isInvalid = errors.length > 0;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>
                  Course Title <span className="text-destructive">*</span>
                </FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="e.g. Introduction to Physics"
                  aria-invalid={isInvalid}
                />
                {isInvalid && <FieldError errors={errors} />}
              </Field>
            );
          }}
        </form.Field>

        <form.Field name="code">
          {(field) => {
            const errors = getFieldError(field.name, field.state.meta.errors);
            const isInvalid = errors.length > 0;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>
                  Course Code <span className="text-destructive">*</span>
                </FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="e.g. PHY101"
                  aria-invalid={isInvalid}
                />
                {isInvalid && <FieldError errors={errors} />}
              </Field>
            );
          }}
        </form.Field>

        <div className="grid grid-cols-2 gap-4">
          <form.Field name="credits">
            {(field) => {
              const errors = getFieldError(field.name, field.state.meta.errors);
              const isInvalid = errors.length > 0;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>
                    Credits <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="number"
                    value={field.state.value ?? ""}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(Number(e.target.value))}
                    placeholder="3"
                    aria-invalid={isInvalid}
                  />
                  {isInvalid && <FieldError errors={errors} />}
                </Field>
              );
            }}
          </form.Field>

          <form.Field name="maxStudents">
            {(field) => {
              const errors = getFieldError(field.name, field.state.meta.errors);
              const isInvalid = errors.length > 0;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>
                    Max Students <span className="text-destructive">*</span>
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
          </form.Field>
        </div>

        <form.Field name="semesterId">
          {(field) => {
            const errors = getFieldError(field.name, field.state.meta.errors);
            const isInvalid = errors.length > 0;
            return (
              <Field data-invalid={isInvalid}>
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
        </form.Field>

        <form.Field name="sessionId">
          {(field) => {
            const errors = getFieldError(field.name, field.state.meta.errors);
            const isInvalid = errors.length > 0;
            return (
              <Field data-invalid={isInvalid}>
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
        </form.Field>

        <form.Field name="teacherId">
          {(field) => {
            const errors = getFieldError(field.name, field.state.meta.errors);
            const isInvalid = errors.length > 0;
            return (
              <Field data-invalid={isInvalid}>
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
        </form.Field>

        <form.Field name="description">
          {(field) => {
            return (
              <Field>
                <FieldLabel htmlFor={field.name}>Description</FieldLabel>
                <Textarea
                  id={field.name}
                  name={field.name}
                  value={field.state.value ?? ""}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Brief description"
                  className="min-h-[100px]"
                />
              </Field>
            );
          }}
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
          <Button type="submit" className="w-full mt-2" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        )}
      </form.Subscribe>
    </form>
  );
}
