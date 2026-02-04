'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { IconLogout, IconSettings, IconUser } from '@tabler/icons-react';

import { useLogout } from '@/hooks/useAuth';
import { useSession } from '@/lib/auth-client';
import Link from 'next/link';

export function ProfileDropdown() {
  const { data: session, isPending } = useSession();
  const logoutMutation = useLogout();

  const user = session?.user;

  if (isPending) {
    return (
      <Button variant='ghost' className='relative h-8 w-8 rounded-full'>
        <Avatar className='h-8 w-8'>
          <AvatarFallback>...</AvatarFallback>
        </Avatar>
      </Button>
    );
  }

  if (!user) {
    return null;
  }

  const initials =
    user.name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U';

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger
        render={
          <Button
            variant='ghost'
            className='relative h-8 w-8 rounded-full cursor-pointer'
          >
            <Avatar className='h-8 w-8'>
              <AvatarImage src={user.image || ''} alt={user.name || 'User'} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          </Button>
        }
      />
      <DropdownMenuContent className='w-56' align='end'>
        <DropdownMenuGroup>
          <DropdownMenuLabel className='font-normal'>
            <div className='flex flex-col gap-1.5 text-foreground'>
              <p className='text-sm leading-none font-medium'>{user.name}</p>
              <p className='text-xs text-muted-foreground leading-none'>
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            render={
              <Link href='/dashboard'>
                <IconUser size={16} />
                Profile
              </Link>
            }
          />
          <DropdownMenuItem
            render={
              <Link href='/dashboard'>
                <IconSettings size={16} />
                Settings
              </Link>
            }
          />
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant='destructive'
          onClick={handleLogout}
          disabled={logoutMutation.isPending}
        >
          <IconLogout size={16} />
          {logoutMutation.isPending ? 'Signing out...' : 'Sign out'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
