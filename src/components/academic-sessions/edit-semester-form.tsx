"use client";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useUpdateSemester } from "@/hooks/use-semesters";
import { Semester } from "@/lib/api/services/semester.service";
import { useForm, type ValidationError } from "@tanstack/react-form";
import {
  semesterSchema,
  type SemesterFormValues,
} from "@/lib/schemas/semester-schema";
import { useFormErrorHandler } from "@/hooks/use-form-handler";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface EditSemesterFormProps {
  semester: Semester;
  onSuccess?: () => void;
}

export function EditSemesterForm({
  semester,
  onSuccess,
}: EditSemesterFormProps) {
  const updateSemesterMutation = useUpdateSemester();
  const { fieldErrors, globalErrors, handleError } = useFormErrorHandler();

  const form = useForm({
    defaultValues: {
      ordinal: semester.ordinal,
    } as SemesterFormValues,
    validators: {
      onSubmit: semesterSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await updateSemesterMutation.mutateAsync({
          id: semester.id,
          data: {
            ordinal: value.ordinal,
          },
        });
        onSuccess?.();
      } catch (error) {
        handleError(error, value);
      }
    },
  });

  const getFieldError = (
    fieldName: string,
    fieldErrorsState: ValidationError[],
  ) => {
    const errors: Array<{ message?: string } | undefined> = [];

    if (fieldErrorsState.length > 0) {
      fieldErrorsState.forEach((err) => {
        if (typeof err === "string") {
          errors.push({ message: err });
        } else if (err && typeof err === "object" && "message" in err) {
          errors.push({ message: (err as any).message });
        } else {
          errors.push({ message: String(err) });
        }
      });
      return errors;
    }

    if (fieldErrors[fieldName]) {
      return [{ message: fieldErrors[fieldName] }];
    }

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
        <form.Field name="ordinal">
          {(field) => {
            const errors = getFieldError(field.name, field.state.meta.errors);
            const isInvalid = errors.length > 0;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>
                  Semester Ordinal <span className="text-destructive">*</span>
                </FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  type="text"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="e.g. 1st"
                  aria-invalid={isInvalid}
                />
                {isInvalid && <FieldError errors={errors} />}
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
