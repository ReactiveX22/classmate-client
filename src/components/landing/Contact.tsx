'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { IconSend } from '@tabler/icons-react';

export function Contact() {
  return (
    <section id='contact' className='py-24 px-6 bg-muted/30'>
      <div className='max-w-2xl mx-auto'>
        <div className='text-center mb-12'>
          <h2 className='text-3xl font-bold mb-4'>Contact Us</h2>
          <p className='text-muted-foreground'>
            Have questions or suggestions? We&apos;d love to hear from you.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Send us a message</CardTitle>
            <CardDescription>
              Fill out the form below and we&apos;ll get back to you.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className='space-y-6 flex flex-col'>
              <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <Label htmlFor='name'>Name</Label>
                  <Input id='name' placeholder='John Doe' />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='email'>Email</Label>
                  <Input
                    id='email'
                    type='email'
                    placeholder='john@example.com'
                  />
                </div>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='message'>Message</Label>
                <Textarea
                  id='message'
                  placeholder='How can we help?'
                  className='min-h-30'
                />
              </div>
              <Button type='submit' className='ml-auto'>
                <IconSend /> Send Message
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
