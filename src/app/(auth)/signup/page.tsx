'use client';

import { Button, buttonVariants } from '@/components/ui/button';
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
import { cn } from '@/lib/utils';
import { IconSchool } from '@tabler/icons-react';
import { useForm } from '@tanstack/react-form';
import { useSignup } from '@/hooks/useAuth';
import Link from 'next/link';
import { useState } from 'react';
import { z } from 'zod';

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  organizationName: z.string().min(2, 'Organization name is required'),
});

export default function SignupPage() {
  const signupMutation = useSignup();
  const [errorMessage, setErrorMessage] = useState<string>('');

  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      organizationName: '',
    },
    validators: {
      onChange: ({ value }) => {
        const result = signupSchema.safeParse(value);
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
        await signupMutation.mutateAsync({
          name: value.name,
          email: value.email,
          password: value.password,
          organizationName: value.organizationName,
        });
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : 'Signup failed'
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

      <Card className='border-0 shadow-none bg-transparent'>
        <CardHeader className='text-center space-y-1 pb-4'>
          <CardTitle className='text-2xl'>Create your organization</CardTitle>
          <CardDescription>
            Sign up as an admin and create your organization.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className='space-y-4'
          >
            {errorMessage && (
              <div className='p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md'>
                {errorMessage}
              </div>
            )}
            <FieldGroup>
              <form.Field name='name'>
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched &&
                    field.state.meta.errors?.length > 0;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Your Name</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder='e.g. John Doe'
                        aria-invalid={isInvalid}
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </form.Field>

              <form.Field name='email'>
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched &&
                    field.state.meta.errors?.length > 0;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        type='email'
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder='admin@organization.com'
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
                    field.state.meta.isTouched &&
                    field.state.meta.errors?.length > 0;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        type='password'
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder='At least 8 characters'
                        aria-invalid={isInvalid}
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </form.Field>

              <form.Field name='organizationName'>
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched &&
                    field.state.meta.errors?.length > 0;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>
                        Organization Name
                      </FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder='e.g. Acme University'
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

            <Button
              type='submit'
              className='w-full'
              disabled={signupMutation.isPending}
            >
              {signupMutation.isPending
                ? 'Creating organization...'
                : 'Create Organization'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className='flex flex-col gap-4 pt-0'>
          <div className='text-center text-sm text-muted-foreground'>
            Already have an account?{' '}
            <Link
              href='/login'
              className='font-medium text-primary underline-offset-4 hover:underline'
            >
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
