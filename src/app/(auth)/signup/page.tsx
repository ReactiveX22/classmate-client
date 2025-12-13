import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  IconArrowRight,
  IconBook,
  IconSchool,
  IconUser,
} from '@tabler/icons-react';
import Link from 'next/link';

export default function SignupSelectionPage() {
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
      <div className='text-center space-y-2'>
        <h1 className='text-2xl font-bold tracking-tight'>Create an account</h1>
        <p className='text-muted-foreground'>
          Select your role to continue to the registration.
        </p>
      </div>

      <div className='grid gap-4'>
        <Link href='/signup/student'>
          <Card className='relative overflow-hidden hover:border-primary/50 transition-colors cursor-pointer group'>
            <CardHeader className='flex flex-row items-center gap-4 pb-4'>
              <div className='w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center transition-colors'>
                <IconUser size={24} />
              </div>
              <div className='space-y-1 flex-1'>
                <CardTitle className='text-lg'>Student</CardTitle>
                <CardDescription>
                  Access your courses, view grades, and submit assignments.
                </CardDescription>
              </div>
              <IconArrowRight
                className='text-primary opacity-0 -translate-x-2 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300'
                size={20}
              />
            </CardHeader>
          </Card>
        </Link>

        <Link href='/signup/teacher'>
          <Card className='relative overflow-hidden hover:border-primary/50 transition-colors cursor-pointer group'>
            <CardHeader className='flex flex-row items-center gap-4 pb-4'>
              <div className='w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center transition-colors'>
                <IconBook size={24} />
              </div>
              <div className='space-y-1 flex-1'>
                <CardTitle className='text-lg'>Teacher</CardTitle>
                <CardDescription>
                  Manage courses, grade submissions, and track attendance.
                </CardDescription>
              </div>
              <IconArrowRight
                className='text-primary opacity-0 -translate-x-2 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300'
                size={20}
              />
            </CardHeader>
          </Card>
        </Link>
      </div>

      <div className='text-center text-sm text-muted-foreground mt-4'>
        Already have an account?{' '}
        <Link
          href='/login'
          className='font-medium text-primary underline-offset-4 hover:underline'
        >
          Sign in
        </Link>
      </div>
    </div>
  );
}
