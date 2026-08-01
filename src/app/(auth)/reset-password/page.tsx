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
import { useResetPassword } from "@/hooks/useAuth";
import { IconSchool } from "@tabler/icons-react";
import { useForm } from "@tanstack/react-form";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { z } from "zod";

const resetPasswordSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Password must be at least 8 characters"),
});

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[60vh]">
          <span className="text-muted-foreground">Loading...</span>
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const resetMutation = useResetPassword();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [success, setSuccess] = useState(false);

  const token = searchParams.get("token");

  const form = useForm({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    validators: {
      onChange: ({ value }) => {
        const result = resetPasswordSchema.safeParse(value);
        if (!result.success) {
          const errors: Record<string, string> = {};
          result.error.issues.forEach((issue) => {
            const path = issue.path.join(".");
            errors[path] = issue.message;
          });
          return errors;
        }
        if (value.password !== value.confirmPassword) {
          return { confirmPassword: "Passwords do not match" };
        }
        return undefined;
      },
    },
    onSubmit: async ({ value }) => {
      setErrorMessage("");
      try {
        await resetMutation.mutateAsync({
          newPassword: value.password,
          token: token ?? "",
        });
        setSuccess(true);
        setTimeout(() => router.push("/login"), 1500);
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : "Password reset failed",
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
          <CardTitle className="text-2xl">Reset your password</CardTitle>
          <CardDescription>
            {success
              ? "Your password has been reset successfully."
              : "Enter a new password for your account."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {success ? (
            <div className="text-sm text-muted-foreground">
              Redirecting you to sign in...
            </div>
          ) : !token ? (
            <div className="flex flex-col gap-4">
              <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md p-3">
                This reset link is invalid or expired. Please request a new one.
              </div>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => router.push("/forgot-password")}
              >
                Request a new reset link
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
                <form.Field name="password">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched &&
                      field.state.meta.errors?.length > 0;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>
                          New Password
                        </FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder="Enter a new password"
                          type="password"
                          autoComplete="new-password"
                          aria-invalid={isInvalid}
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>

                <form.Field name="confirmPassword">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched &&
                      field.state.meta.errors?.length > 0;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>
                          Confirm Password
                        </FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder="Re-enter your new password"
                          type="password"
                          autoComplete="new-password"
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
                    disabled={!canSubmit || resetMutation.isPending}
                  >
                    {resetMutation.isPending || isSubmitting
                      ? "Resetting..."
                      : "Reset password"}
                  </Button>
                )}
              </form.Subscribe>
            </form>
          )}
        </CardContent>
        <CardFooter className="flex justify-center border-t p-4 bg-muted/20">
          <div className="text-sm text-muted-foreground">
            Changed your mind?{" "}
            <Link
              href="/login"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Back to sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
