'use client';

import { ChangePasswordForm } from '@/components/settings/change-password-form';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { IconLock, IconUser } from '@tabler/icons-react';

export default function SettingsPage() {
  return (
    <div className='container mx-auto py-8 px-8 max-w-7xl'>
      <div className='space-y-0.5 mb-8'>
        <h2 className='text-2xl font-bold tracking-tight'>Settings</h2>
        <p className='text-muted-foreground'>
          Manage your account settings and preferences.
        </p>
      </div>

      <div className='flex flex-col lg:flex-row gap-8'>
        <Tabs defaultValue='security' className='w-full' orientation='vertical'>
          <div className='flex flex-col lg:flex-row gap-8'>
            <div className='flex-1'>
              <TabsContent value='profile' className='mt-0'>
                {/* Profile settings would go here */}
              </TabsContent>

              <TabsContent value='security' className='mt-0 space-y-6'>
                {/* <div>
                  <h3 className='text-lg font-medium'>Security</h3>
                  <p className='text-sm text-muted-foreground'>
                    Update your security settings. Change your password and
                    manage sessions.
                  </p>
                </div> */}
                {/* <Separator /> */}
                <ChangePasswordForm />
              </TabsContent>
            </div>

            {/* <aside className='lg:w-1/4'>
              <TabsList className='flex flex-col h-auto bg-transparent border-none p-0 items-start space-y-1'>
                <TabsTrigger
                  value='profile'
                  className='w-full justify-start gap-2 px-4 py-2 hover:bg-muted data-[state=active]:bg-muted data-[state=active]:shadow-none'
                  disabled
                >
                  <IconUser size={18} />
                  Profile
                  <span className='ml-auto text-[10px] uppercase font-bold text-muted-foreground bg-muted-foreground/10 px-1 rounded'>
                    Soon
                  </span>
                </TabsTrigger>
                <TabsTrigger
                  value='security'
                  className='w-full justify-start gap-2 px-4 py-2 hover:bg-muted data-[state=active]:bg-muted data-[state=active]:shadow-none'
                >
                  <IconLock size={18} />
                  Security
                </TabsTrigger>
              </TabsList>
            </aside> */}
          </div>
        </Tabs>
      </div>
    </div>
  );
}
