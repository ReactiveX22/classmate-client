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
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useLogin } from '@/hooks/useAuth';
import { IconSchool } from '@tabler/icons-react';
import { useForm } from '@tanstack/react-form';
import Link from 'next/link';
import { useState } from 'react';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function LoginPage() {
  const loginMutation = useLogin();
  const [errorMessage, setErrorMessage] = useState<string>('');

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    validators: {
      onChange: ({ value }) => {
        const result = loginSchema.safeParse(value);
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
        await loginMutation.mutateAsync({
          email: value.email,
          password: value.password,
        });
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : 'Login failed'
        );
      }
    },
  });

  return (
    <div className='flex flex-col gap-6'>
      <Link
        href='/'
        className='self-center flex items-center gap-2 font-bold text-xl text-muted-foreground hover:text-foreground transition-colors'
      >
        <div className='w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground'>
          <IconSchool size={20} />
        </div>
        <span>ClassMate</span>
      </Link>
      <Card className='w-full shadow-lg'>
        <CardHeader>
          <CardTitle className='text-2xl'>Sign In</CardTitle>
          <CardDescription>
            Welcome back! Please enter your details.
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
              <form.Field name='email'>
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
                        placeholder='m@example.com'
                        type='email'
                        aria-invalid={isInvalid}
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </form.Field>

              <form.Field name='password'>
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Password</FieldLabel>
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
            </FieldGroup>

            {errorMessage && (
              <div className='text-sm text-red-500 bg-red-50 border border-red-200 rounded-md p-3'>
                {errorMessage}
              </div>
            )}

            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
            >
              {([canSubmit, isSubmitting]) => (
                <Button
                  type='submit'
                  className='w-full mt-4'
                  disabled={!canSubmit || loginMutation.isPending}
                >
                  {loginMutation.isPending || isSubmitting
                    ? 'Signing in...'
                    : 'Sign in'}
                </Button>
              )}
            </form.Subscribe>
          </form>
        </CardContent>
        <CardFooter className='flex justify-center border-t p-4 bg-muted/20'>
          <div className='text-sm text-muted-foreground'>
            Don&apos;t have an account?{' '}
            <Link
              href='/signup'
              className='font-medium text-primary underline-offset-4 hover:underline'
            >
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
