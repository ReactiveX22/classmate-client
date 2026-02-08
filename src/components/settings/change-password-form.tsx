'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { authClient } from '@/lib/auth-client';
import { useForm } from '@tanstack/react-form';
import { useState } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(8, 'New password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your new password'),
    revokeOtherSessions: z.boolean().default(true),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export function ChangePasswordForm() {
  const [errorMessage, setErrorMessage] = useState<string>('');

  const form = useForm({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      revokeOtherSessions: true,
    },
    validators: {
      onChange: ({ value }) => {
        const result = changePasswordSchema.safeParse(value);
        if (result.success) return undefined;

        const errors: Record<string, string> = {};
        result.error.issues.forEach((issue) => {
          const path = issue.path.join('.');
          errors[path] = issue.message;
        });
        return errors;
      },
    },
    onSubmit: async ({ value }) => {
      setErrorMessage('');
      try {
        const { error } = await authClient.changePassword({
          currentPassword: value.currentPassword,
          newPassword: value.newPassword,
          revokeOtherSessions: value.revokeOtherSessions,
        });

        if (error) {
          setErrorMessage(error.message || 'Failed to change password');
          toast.error(error.message || 'Failed to change password');
          return;
        }

        toast.success('Password changed successfully');
        form.reset();
      } catch (error) {
        const msg =
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred';
        setErrorMessage(msg);
        toast.error(msg);
      }
    },
  });

  return (
    <Card className='w-full md:min-w-md'>
      <CardHeader>
        <CardTitle className='text-xl'>Change Password</CardTitle>
        <CardDescription>
          Ensure your account is using a long, random password to stay secure.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className='flex flex-col gap-4'
        >
          <FieldGroup>
            <form.Field name='currentPassword'>
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>
                      Current Password
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder='••••••••'
                      type='password'
                      aria-invalid={isInvalid}
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>

            <form.Field name='newPassword'>
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>New Password</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder='••••••••'
                      type='password'
                      aria-invalid={isInvalid}
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>

            <form.Field name='confirmPassword'>
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>
                      Confirm New Password
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder='••••••••'
                      type='password'
                      aria-invalid={isInvalid}
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>

            <form.Field name='revokeOtherSessions'>
              {(field) => (
                <div className='flex items-center space-x-2'>
                  <Checkbox
                    id={field.name}
                    checked={field.state.value}
                    onCheckedChange={(checked) => field.handleChange(!!checked)}
                  />
                  <FieldLabel
                    htmlFor={field.name}
                    className='text-sm font-normal leading-none cursor-pointer'
                  >
                    Log out of other devices
                  </FieldLabel>
                </div>
              )}
            </form.Field>
          </FieldGroup>

          {errorMessage && (
            <div className='text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md p-3'>
              {errorMessage}
            </div>
          )}

          <div className='flex justify-end'>
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
            >
              {([canSubmit, isSubmitting]) => (
                <Button
                  type='submit'
                  className='w-full sm:w-auto'
                  disabled={!canSubmit || isSubmitting}
                >
                  {isSubmitting ? 'Updating...' : 'Update Password'}
                </Button>
              )}
            </form.Subscribe>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
