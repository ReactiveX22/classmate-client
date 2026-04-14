"use client";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCreateCourse } from "@/hooks/use-courses";
import { ErrorCode } from "@/types/errors";
import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { TeacherSelect } from "./teacher-select";

const courseSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters long"),
  code: z.string().min(2, "Course code must be at least 2 characters long"),
  description: z.string().optional(),
  credits: z.number().min(1, "Credits must be at least 1"),
  semester: z.string().min(1, "Semester must be at least 1 characters long"),
  session: z.string().optional(),
  maxStudents: z.number().min(1, "Must be at least 1 student"),
  teacherId: z.string().optional(),
});

interface AddCourseFormProps {
  onSuccess?: () => void;
}

export function AddCourseForm({ onSuccess }: AddCourseFormProps) {
  const createCourseMutation = useCreateCourse();
  const [globalError, setGlobalError] = useState("");

  const form = useForm({
    defaultValues: {
      title: "",
      code: "",
      description: "",
      credits: 3,
      semester: "",
      session: "",
      maxStudents: 50,
      teacherId: "",
    },
    validators: {
      onSubmit: courseSchema,
    },
    onSubmit: async ({ value }) => {
      setGlobalError("");
      try {
        await createCourseMutation.mutateAsync({
          title: value.title,
          code: value.code,
          description: value.description || undefined,
          credits: value.credits,
          semester: value.semester,
          session: value.session || undefined,
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
        } else {
          setGlobalError(
            error.response?.data?.message ||
              error.message ||
              "Failed to create course",
          );
        }
      }
    },
  });

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
              const isInvalid =
                field.state.meta.isTouched &&
                field.state.meta.errors.length > 0;
              return (
                <Field data-invalid={isInvalid} className="sm:col-span-3">
                  <FieldLabel htmlFor={field.name}>Course Title</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="e.g. Introduction to Computer Science"
                    aria-invalid={isInvalid}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />

          <form.Field
            name="code"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched &&
                field.state.meta.errors.length > 0;
              return (
                <Field data-invalid={isInvalid} className="sm:col-span-1">
                  <FieldLabel htmlFor={field.name}>Code</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="CS101"
                    aria-invalid={isInvalid}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />

          <form.Field
            name="semester"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched &&
                field.state.meta.errors.length > 0;
              return (
                <Field data-invalid={isInvalid} className="sm:col-span-2">
                  <FieldLabel htmlFor={field.name}>Semester</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="e.g. 8th"
                    aria-invalid={isInvalid}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />

          <form.Field
            name="session"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched &&
                field.state.meta.errors.length > 0;
              return (
                <Field data-invalid={isInvalid} className="sm:col-span-2">
                  <FieldLabel htmlFor={field.name}>Session</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="e.g. Spring 2025"
                    aria-invalid={isInvalid}
                  />

                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />

          <form.Field
            name="credits"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched &&
                field.state.meta.errors.length > 0;
              return (
                <Field data-invalid={isInvalid} className="sm:col-span-1">
                  <FieldLabel htmlFor={field.name}>Credits</FieldLabel>
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
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />

          <form.Field
            name="maxStudents"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched &&
                field.state.meta.errors.length > 0;
              return (
                <Field data-invalid={isInvalid} className="sm:col-span-1">
                  <FieldLabel htmlFor={field.name}>Capacity</FieldLabel>
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
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />

          <form.Field
            name="teacherId"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched &&
                field.state.meta.errors.length > 0;
              return (
                <Field data-invalid={isInvalid} className="sm:col-span-4">
                  <FieldLabel htmlFor={field.name}>Assign Teacher</FieldLabel>
                  <TeacherSelect
                    value={field.state.value}
                    onValueChange={(val) => field.handleChange(val || "")}
                    error={isInvalid}
                  />

                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
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
                    value={field.state.value}
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

        {globalError && (
          <div className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-md p-3 mt-2">
            {globalError}
          </div>
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
                disabled={!canSubmit || isSubmitting}
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
