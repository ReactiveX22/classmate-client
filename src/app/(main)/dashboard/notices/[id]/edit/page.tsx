'use client';

import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { PageHeader } from '@/components/common/page-header';
import { NoticeForm, NoticeFormValues } from '@/components/notices/notice-form';
import { useNotice, useUpdateNotice } from '@/hooks/use-notices';
import { Loader2 } from 'lucide-react';

export default function EditNoticePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const { data, isLoading } = useNotice(id);
  const { mutateAsync: updateNotice, isPending: isUpdating } =
    useUpdateNotice();

  const onSubmit = async (values: NoticeFormValues) => {
    try {
      await updateNotice({ id, data: values });
      toast.success('Notice updated successfully');
      router.push('/dashboard/notices');
    } catch (error) {
      toast.error('Failed to update notice');
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <div className='flex h-full items-center justify-center'>
        <Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
      </div>
    );
  }

  if (!data) {
    return (
      <div className='flex flex-col h-full bg-background'>
        <PageHeader title='Edit Notice' />
        <div className='flex flex-1 items-center justify-center text-muted-foreground'>
          Notice not found
        </div>
      </div>
    );
  }

  return (
    <div className='flex flex-col h-full'>
      <PageHeader
        title='Edit Notice'
        description='Make changes to the notice.'
      />
      <div className='flex-1 p-6 max-w-6xl'>
        <NoticeForm
          initialData={data.notice}
          onSubmit={onSubmit}
          isSubmitting={isUpdating}
          submitLabel='Save Changes'
        />
      </div>
    </div>
  );
}
