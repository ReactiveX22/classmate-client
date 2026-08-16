"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useRequestPasswordReset } from "@/hooks/useAuth";
import { IconSchool } from "@tabler/icons-react";
import { useForm } from "@tanstack/react-form";
import Link from "next/link";
import { useState } from "react";
import { z } from "zod";

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export default function ForgotPasswordPage() {
  const requestResetMutation = useRequestPasswordReset();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [submitted, setSubmitted] = useState(false);

  const form = useForm({
    defaultValues: {
      email: "",
    },
    validators: {
      onChange: ({ value }) => {
        const result = forgotPasswordSchema.safeParse(value);
        if (result.success) return undefined;

        const errors: Record<string, string> = {};
        result.error.issues.forEach((issue) => {
          const path = issue.path.join(".");
          errors[path] = issue.message;
        });
        return errors;
      },
    },
    onSubmit: async ({ value }) => {
      setErrorMessage("");
      try {
        await requestResetMutation.mutateAsync(value.email);
        setSubmitted(true);
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Failed to request password reset",
        );
      }
    },
  });

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/"
        className="self-center flex items-center gap-2 font-bold text-xl text-muted-foreground hover:text-foreground transition-colors"
      >
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground">
          <IconSchool size={20} />
        </div>
        <span>ClassMate</span>
      </Link>

      <Card className="w-full shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Forgot your password?</CardTitle>
          <CardDescription>
            {submitted
              ? "We've sent a reset link to your email if the account exists."
              : "Enter your email and we'll send you a link to reset your password."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {submitted ? (
            <div className="flex flex-col gap-4">
              <div className="text-sm text-muted-foreground">
                Check your inbox and follow the link to set a new password.
              </div>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => {
                  setSubmitted(false);
                  form.reset();
                }}
              >
                Resend reset link
              </Button>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
              }}
              className="flex flex-col gap-4"
            >
              <FieldGroup>
                <form.Field name="email">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder="m@example.com"
                          type="email"
                          aria-invalid={isInvalid}
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>
              </FieldGroup>

              {errorMessage && (
                <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md p-3">
                  {errorMessage}
                </div>
              )}

              <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
              >
                {([canSubmit, isSubmitting]) => (
                  <Button
                    type="submit"
                    className="w-full mt-4"
                    disabled={!canSubmit || requestResetMutation.isPending}
                  >
                    {requestResetMutation.isPending || isSubmitting
                      ? "Sending..."
                      : "Send reset link"}
                  </Button>
                )}
              </form.Subscribe>
            </form>
          )}
        </CardContent>
        <CardFooter className="flex justify-center border-t p-4 bg-muted/20">
          <div className="text-sm text-muted-foreground">
            Remembered your password?{" "}
            <Link
              href="/login"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
