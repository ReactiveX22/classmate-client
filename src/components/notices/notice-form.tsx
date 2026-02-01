'use client';

import { Button } from '@/components/ui/button';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';
import { useForm } from '@tanstack/react-form';
import { z } from 'zod';
import { Notice } from '@/lib/api/services/notice.service';
import { useState } from 'react';

const noticeSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().optional(),
  tags: z.array(z.string()).default([]),
});

export type NoticeFormValues = z.infer<typeof noticeSchema>;

interface NoticeFormProps {
  initialData?: Notice;
  onSubmit: (values: NoticeFormValues) => void;
  isSubmitting?: boolean;
  submitLabel?: string;
}

export function NoticeForm({
  initialData,
  onSubmit,
  isSubmitting,
  submitLabel = 'Save',
}: NoticeFormProps) {
  const [currentTag, setCurrentTag] = useState('');

  const form = useForm({
    defaultValues: {
      title: initialData?.title || '',
      content: initialData?.content || '',
      tags: initialData?.tags || [],
    },
    validators: {
      onChange: noticeSchema,
    },
    onSubmit: async ({ value }) => {
      onSubmit(value);
    },
  });

  const handleAddTag = (
    pushValue: (val: string) => void,
    currentTags: string[],
  ) => {
    const tag = currentTag.trim();
    if (tag && !currentTags.includes(tag)) {
      pushValue(tag);
      setCurrentTag('');
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent,
    pushValue: (val: string) => void,
    currentTags: string[],
  ) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag(pushValue, currentTags);
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className='flex flex-col gap-6'
    >
      <FieldGroup>
        <form.Field name='title'>
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && field.state.meta.errors.length > 0;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Title</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder='Enter notice title'
                  aria-invalid={isInvalid}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        <form.Field name='content'>
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && field.state.meta.errors.length > 0;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Content</FieldLabel>
                <Textarea
                  id={field.name}
                  name={field.name}
                  value={field.state.value || ''}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder='Enter notice details...'
                  className='min-h-[120px]'
                  aria-invalid={isInvalid}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        <form.Field name='tags' mode='array'>
          {(field) => {
            return (
              <Field>
                <FieldLabel htmlFor='tag-input'>Tags</FieldLabel>
                <div className='space-y-3'>
                  <div className='flex gap-2'>
                    <Input
                      id='tag-input'
                      placeholder='Add a tag and press Enter'
                      value={currentTag}
                      onChange={(e) => setCurrentTag(e.target.value)}
                      onKeyDown={(e) =>
                        handleKeyDown(e, field.pushValue, field.state.value)
                      }
                    />
                    <Button
                      type='button'
                      variant='outline'
                      size='icon'
                      onClick={() =>
                        handleAddTag(field.pushValue, field.state.value)
                      }
                    >
                      <Plus className='h-4 w-4' />
                    </Button>
                  </div>
                  <div className='flex flex-wrap gap-2'>
                    {field.state.value.map((tag, index) => (
                      <Badge
                        key={`${tag}-${index}`}
                        variant='secondary'
                        className='gap-1 pl-2.5'
                      >
                        {tag}
                        <button
                          type='button'
                          onClick={() => field.removeValue(index)}
                          className='ml-1 rounded-full p-0.5 hover:bg-muted-foreground/20'
                        >
                          <X className='h-3 w-3' />
                          <span className='sr-only'>Remove {tag} tag</span>
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
                <p className='text-xs text-muted-foreground'>
                  Categorize your notice with tags (e.g., urgent, announcement).
                </p>
              </Field>
            );
          }}
        </form.Field>
      </FieldGroup>

      <div className='flex justify-end pt-2'>
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
        >
          {([canSubmit]) => (
            <Button type='submit' disabled={!canSubmit || isSubmitting}>
              {isSubmitting ? 'Saving...' : submitLabel}
            </Button>
          )}
        </form.Subscribe>
      </div>
    </form>
  );
}
