'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useCreatePost } from '@/hooks/use-create-post';
import { UploadResult } from '@/hooks/use-upload-attachment';
import {
  CreatePostDto,
  PostType,
  SubmissionType,
} from '@/lib/api/services/post.service';
import { cn } from '@/lib/utils';
import { IconCalendar } from '@tabler/icons-react';
import { useForm } from '@tanstack/react-form';
import { format } from 'date-fns';
import { useState } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';
import { AttachmentUpload } from './attachment-upload';

// Zod Schemas
const baseSchema = z.object({
  content: z.string().min(1, 'Content is required'),
  isPinned: z.boolean(),
  commentsEnabled: z.boolean(),
});

const assignmentSchema = baseSchema.extend({
  type: z.literal('assignment'),
  title: z.string().min(1, 'Title is required'),
  assignmentData: z.object({
    dueDate: z.date().optional(),
    points: z.number().min(0).max(1000),
    submissionType: z.enum(['file', 'text', 'link', 'multiple'] as const),
    allowLateSubmission: z.boolean(),
  }),
});

const materialSchema = baseSchema.extend({
  type: z.literal('material'),
  title: z.string().min(1, 'Title is required'),
});

const announcementSchema = baseSchema.extend({
  type: z.literal('announcement'),
  title: z.string().optional(),
});

const questionSchema = baseSchema.extend({
  type: z.literal('question'),
  title: z.string().optional(),
});

const postSchema = z.discriminatedUnion('type', [
  announcementSchema,
  assignmentSchema,
  materialSchema,
  questionSchema,
]);

type PostFormData = z.infer<typeof postSchema>;

interface CreatePostFormProps {
  classroomId: string;
  onSuccess?: () => void;
}

export function CreatePostForm({
  classroomId,
  onSuccess,
}: CreatePostFormProps) {
  const { mutateAsync: createPost, isPending } = useCreatePost();
  const [globalError, setGlobalError] = useState('');
  const [attachments, setAttachments] = useState<UploadResult[]>([]);

  const form = useForm({
    defaultValues: {
      type: 'announcement',
      content: '',
      isPinned: false,
      commentsEnabled: true,
      title: '',
    } as PostFormData,
    validators: {
      onSubmit: postSchema,
    },
    onSubmit: async ({ value }) => {
      setGlobalError('');
      try {
        const payload: CreatePostDto = {
          type: value.type,
          content: value.content,
          isPinned: value.isPinned,
          commentsEnabled: value.commentsEnabled,
          title: value.title?.trim() || undefined,
          attachments: attachments.length > 0 ? attachments : undefined,
        };

        if (value.type === 'assignment') {
          payload.assignmentData = {
            ...value.assignmentData,
            dueDate: value.assignmentData.dueDate?.toISOString(),
          };
        }

        await createPost({ classroomId, data: payload });

        form.reset();
        setAttachments([]);
        onSuccess?.();
      } catch (error) {
        setGlobalError('Failed to create post. Please try again.');
        // Note: useCreatePost already has toast.error in its onError
      }
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className='space-y-6 py-4'
    >
      <FieldGroup>
        {/* Post Type Selector */}
        <form.Field name='type'>
          {(field) => (
            <Field>
              <FieldLabel htmlFor={field.name}>Post Type</FieldLabel>
              <Select
                value={field.state.value}
                onValueChange={(val) => {
                  field.handleChange(val as PostType);
                  // Set defaults when switching types
                  if (val === 'assignment') {
                    form.setFieldValue('assignmentData', {
                      points: 100,
                      submissionType: 'file',
                      allowLateSubmission: true,
                    });
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue className='capitalize' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='announcement'>Announcement</SelectItem>
                  <SelectItem value='assignment'>Assignment</SelectItem>
                  <SelectItem value='material'>Material</SelectItem>
                  <SelectItem value='question'>Question</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          )}
        </form.Field>

        {/* Title Field (Conditional) */}
        <form.Subscribe
          selector={(state) => state.values.type}
          children={(type) => {
            const isRequired = type === 'assignment' || type === 'material';
            if (!isRequired && type !== 'question' && type !== 'announcement')
              return null;

            if (type === 'announcement') return null;

            return (
              <form.Field name='title'>
                {(field) => (
                  <Field data-invalid={field.state.meta.errors.length > 0}>
                    <FieldLabel htmlFor={field.name}>
                      Title {isRequired ? '*' : '(Optional)'}
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value || ''}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder='Enter title'
                    />
                    <FieldError errors={field.state.meta.errors} />
                  </Field>
                )}
              </form.Field>
            );
          }}
        />

        {/* Content Field */}
        <form.Field name='content'>
          {(field) => (
            <Field data-invalid={field.state.meta.errors.length > 0}>
              <FieldLabel htmlFor={field.name}>Content</FieldLabel>
              <Textarea
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                className='min-h-[100px]'
                placeholder='Share with your class...'
              />
              <FieldError errors={field.state.meta.errors} />
            </Field>
          )}
        </form.Field>

        {/* Assignment Specific Fields */}
        <form.Subscribe
          selector={(state) => state.values.type}
          children={(type) =>
            type === 'assignment' ? (
              <div className='space-y-4 border rounded-lg p-4 bg-muted/20'>
                <h4 className='font-medium text-sm'>Assignment Details</h4>
                <div className='grid grid-cols-2 gap-4'>
                  {/* Due Date */}
                  <form.Field name='assignmentData.dueDate'>
                    {(field) => (
                      <Field>
                        <FieldLabel>Due Date</FieldLabel>
                        <Popover>
                          <PopoverTrigger
                            render={
                              <Button
                                variant='outline'
                                className={cn(
                                  'w-full justify-start text-left font-normal',
                                  !field.state.value && 'text-muted-foreground'
                                )}
                              >
                                <IconCalendar className='mr-2 h-4 w-4' />
                                {field.state.value ? (
                                  format(field.state.value, 'PPP')
                                ) : (
                                  <span>Pick a date</span>
                                )}
                              </Button>
                            }
                          />
                          <PopoverContent className='w-auto p-0' align='start'>
                            <Calendar
                              mode='single'
                              selected={field.state.value}
                              onSelect={(date) => field.handleChange(date)}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </Field>
                    )}
                  </form.Field>

                  {/* Points */}
                  <form.Field name='assignmentData.points'>
                    {(field) => (
                      <Field>
                        <FieldLabel>Points</FieldLabel>
                        <Input
                          type='number'
                          min='0'
                          max='1000'
                          value={field.state.value}
                          onChange={(e) =>
                            field.handleChange(Number(e.target.value))
                          }
                        />
                      </Field>
                    )}
                  </form.Field>
                </div>

                {/* Submission Type & Late Submission */}
                <div className='grid gap-2'>
                  <form.Field name='assignmentData.submissionType'>
                    {(field) => (
                      <Field>
                        <FieldLabel>Submission Type</FieldLabel>
                        <Select
                          value={field.state.value}
                          onValueChange={(val) =>
                            field.handleChange(val as SubmissionType)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='file'>File Upload</SelectItem>
                            <SelectItem value='text'>Text Entry</SelectItem>
                            <SelectItem value='link'>Website URL</SelectItem>
                            <SelectItem value='multiple'>
                              Multiple Options
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </Field>
                    )}
                  </form.Field>
                </div>

                <form.Field name='assignmentData.allowLateSubmission'>
                  {(field) => (
                    <div className='flex items-center space-x-2 pt-2'>
                      <Checkbox
                        id='late-submission'
                        checked={field.state.value}
                        onCheckedChange={(checked) =>
                          field.handleChange(!!checked)
                        }
                      />
                      <Label
                        htmlFor='late-submission'
                        className='font-normal text-sm text-muted-foreground'
                      >
                        Allow late submissions
                      </Label>
                    </div>
                  )}
                </form.Field>
              </div>
            ) : null
          }
        />

        {/* Attachments Upload */}
        <AttachmentUpload
          classroomId={classroomId}
          attachments={attachments}
          onAttachmentsChange={setAttachments}
        />

        {/* Footer Options */}
        <div className='flex flex-col gap-3 pt-2'>
          <form.Field name='isPinned'>
            {(field) => (
              <div className='flex items-center space-x-2'>
                <Checkbox
                  id='pinned'
                  checked={field.state.value}
                  onCheckedChange={(checked) => field.handleChange(!!checked)}
                />
                <Label htmlFor='pinned' className='font-medium'>
                  Pin to top of stream
                </Label>
              </div>
            )}
          </form.Field>

          <form.Field name='commentsEnabled'>
            {(field) => (
              <div className='flex items-center space-x-2'>
                <Checkbox
                  id='comments'
                  checked={field.state.value}
                  onCheckedChange={(checked) => field.handleChange(!!checked)}
                />
                <Label htmlFor='comments' className='font-medium'>
                  Enable comments
                </Label>
              </div>
            )}
          </form.Field>
        </div>
      </FieldGroup>

      {globalError && (
        <div className='text-sm text-red-500 bg-red-50 border border-red-200 rounded-md p-3'>
          {globalError}
        </div>
      )}

      <div className='flex justify-end gap-2'>
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <Button type='submit' disabled={!canSubmit || isPending}>
              {isPending ? 'Creating...' : 'Post'}
            </Button>
          )}
        />
      </div>
    </form>
  );
}
