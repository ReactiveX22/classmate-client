'use client';

import { NoticeForm, NoticeFormValues } from '@/components/notices/notice-form';
import { FormPageHeader } from '@/components/ui/form-page-header';
import { useCreateNotice } from '@/hooks/use-notices';
import { Bell } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function NewNoticePage() {
  const router = useRouter();
  const { mutateAsync: createNotice, isPending } = useCreateNotice();

  const onSubmit = async (values: NoticeFormValues) => {
    try {
      await createNotice(values);
      toast.success('Notice created successfully');
      router.push('/dashboard/notices');
    } catch (error) {
      toast.error('Failed to create notice');
      console.error(error);
    }
  };

  return (
    <div className='flex flex-col gap-6 h-full'>
      <FormPageHeader
        icon={<Bell className='size-4' />}
        title='Create Notice'
        description='Create a new notice for your organization.'
        backLink='/dashboard/notices'
      />
      <div className='flex-1 max-w-6xl p-6'>
        <NoticeForm
          onSubmit={onSubmit}
          isSubmitting={isPending}
          submitLabel='Create Notice'
        />
      </div>
    </div>
  );
}
