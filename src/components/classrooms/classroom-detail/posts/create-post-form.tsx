'use client';

import { useCreatePost } from '@/hooks/use-create-post';
import { PostForm } from './post-form';

interface CreatePostFormProps {
  classroomId: string;
  onSuccess?: () => void;
}

export function CreatePostForm({
  classroomId,
  onSuccess,
}: CreatePostFormProps) {
  const { mutateAsync: createPost, isPending } = useCreatePost();

  return (
    <PostForm
      classroomId={classroomId}
      onSubmit={async (data) => {
        await createPost({ classroomId, data });
        onSuccess?.();
      }}
      isSubmitting={isPending}
      submitLabel='Post'
    />
  );
}
