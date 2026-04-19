'use client';

import { useCreatePost } from '@/hooks/use-create-post';
import { PostForm } from './post-form';
import { PostType } from '@/lib/api/services/post.service';

interface CreatePostFormProps {
  classroomId: string;
  onSuccess?: () => void;
  defaultType?: PostType;
  hideTypeSelection?: boolean;
}

export function CreatePostForm({
  classroomId,
  onSuccess,
  defaultType,
  hideTypeSelection,
}: CreatePostFormProps) {
  const { mutateAsync: createPost, isPending } = useCreatePost();

  return (
    <PostForm
      classroomId={classroomId}
      defaultType={defaultType}
      hideTypeSelection={hideTypeSelection}
      onSubmit={async (data) => {
        await createPost({ classroomId, data });
        onSuccess?.();
      }}
      isSubmitting={isPending}
      submitLabel='Post'
    />
  );
}
