'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { PageHeader } from '@/components/common/page-header';
import { NoticeForm, NoticeFormValues } from '@/components/notices/notice-form';
import { useCreateNotice } from '@/hooks/use-notices';

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
    <div className='flex flex-col h-full'>
      <PageHeader
        title='Create Notice'
        description='Create a new notice for your organization.'
      />
      <div className='flex-1 p-6 max-w-6xl'>
        <NoticeForm
          onSubmit={onSubmit}
          isSubmitting={isPending}
          submitLabel='Create Notice'
        />
      </div>
    </div>
  );
}
