import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { authService } from '@/lib/api/services/auth.service';
import { IconHourglass } from '@tabler/icons-react';
import Link from 'next/link';

export default function PendingVerificationPage() {
  return (
    <div className='flex items-center justify-center min-h-[80vh] px-4'>
      <Card className='w-full max-w-md border-muted/60 shadow-lg'>
        <CardHeader className='text-center space-y-4 pb-2'>
          <div className='mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-2'>
            <IconHourglass className='size-8 text-primary' />
          </div>
          <CardTitle className='text-2xl font-bold'>
            Verification Pending
          </CardTitle>
          <CardDescription className='text-base'>
            Your account is currently under review.
          </CardDescription>
        </CardHeader>
        <CardContent className='text-center text-muted-foreground'>
          <p>
            An administrator needs to verify your account and assign a role
            before you can access the platform. This helps us maintain a secure
            academic environment.
          </p>
        </CardContent>
        <CardFooter className='flex flex-col gap-3 pt-4'>
          <Button
            render={<Link href='/'>Back to Home</Link>}
            className='w-full'
          />
          <Button
            variant='outline'
            className='w-full'
            onClick={() => authService.logout()}
          >
            Sign Out
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
