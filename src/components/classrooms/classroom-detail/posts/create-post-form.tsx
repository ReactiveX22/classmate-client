"use client";
import { useEffect } from "react";

import { useCreatePost } from '@/hooks/use-create-post';
import { PostType } from '@/lib/api/services/post.service';
import { PostForm } from './post-form';

interface CreatePostFormProps {
  classroomId: string;
  onSuccess?: () => void;
  defaultType?: PostType;
  hideTypeSelection?: boolean;
  id?: string;
  showFooter?: boolean;
  onPendingChange?: (isPending: boolean) => void;
}

export function CreatePostForm({
  classroomId,
  onSuccess,
  defaultType,
  hideTypeSelection,
  id,
  showFooter,
  onPendingChange,
}: CreatePostFormProps) {
  const { mutateAsync: createPost, isPending } = useCreatePost();
  
  useEffect(() => {
    onPendingChange?.(isPending);
  }, [isPending, onPendingChange]);

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
      submitLabel="Post"
      id={id}
      showFooter={showFooter}
    />
  );
}
