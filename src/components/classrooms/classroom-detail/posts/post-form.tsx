import { AttachmentUpload } from '@/components/common/attachment-upload';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
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
import { useFormErrorHandler } from '@/hooks/use-form-handler';
import {
  UploadResult,
  useUploadAttachment,
} from '@/hooks/use-upload-attachment';
import {
  CreatePostDto,
  postService,
  PostType,
  SubmissionType,
} from '@/lib/api/services/post.service';
import { cn } from '@/lib/utils';
import { IconCalendar } from '@tabler/icons-react';
import { useForm } from '@tanstack/react-form';
import { format } from 'date-fns';
import { Plus, X } from 'lucide-react';
import { useState } from 'react';
import { z } from 'zod';

// Zod Schemas
const baseSchema = z.object({
  content: z.string().min(1, 'Content is required'),
  isPinned: z.boolean(),
  commentsEnabled: z.boolean(),
  tags: z.array(z.string()),
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

export type PostFormData = z.infer<typeof postSchema>;

interface PostFormProps {
  classroomId: string;
  initialValues?: PostFormData;
  defaultType?: PostType;
  initialAttachments?: UploadResult[];
  onSubmit: (data: CreatePostDto) => Promise<void>;
  submitLabel?: string;
  isSubmitting?: boolean;
  hideTypeSelection?: boolean;
}

export function PostForm({
  classroomId,
  initialValues,
  defaultType,
  initialAttachments = [],
  onSubmit,
  submitLabel = 'Post',
  isSubmitting = false,
  hideTypeSelection = false,
}: PostFormProps) {
  const { fieldErrors, globalErrors, handleError } = useFormErrorHandler();
  const [attachments, setAttachments] =
    useState<UploadResult[]>(initialAttachments);
  const [currentTag, setCurrentTag] = useState('');

  const { mutateAsync: uploadFile } = useUploadAttachment();

  const defaultValues: PostFormData = initialValues || ({
    type: defaultType || 'announcement',
    content: '',
    isPinned: false,
    commentsEnabled: true,
    title: '',
    tags: [],
  } as PostFormData);

  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: postSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        const payload: CreatePostDto = {
          type: value.type,
          content: value.content,
          isPinned: value.isPinned,
          commentsEnabled: value.commentsEnabled,
          title: value.title?.trim() || undefined,
          attachments: attachments.length > 0 ? attachments : undefined,
          tags: value.tags || [],
        };

        if (value.type === 'assignment') {
          payload.assignmentData = {
            ...value.assignmentData,
            dueDate: value.assignmentData.dueDate?.toISOString(),
          };
        }

        await onSubmit(payload);

        if (!initialValues) {
          form.reset();
          setAttachments([]);
        }
      } catch (error: any) {
        handleError(error, value);
        console.error(error);
      }
    },
  });

  const getFieldError = (fieldName: string, fieldErrorsState: any[]) => {
    if (fieldErrorsState.length > 0) return fieldErrorsState;
    if (fieldErrors[fieldName]) return [{ message: fieldErrors[fieldName] }];
    return [];
  };

  const handleAddTag = (
    pushValue: (value: string) => void,
    currentTags: string[],
  ) => {
    const normalized = currentTag.trim().replace(/^#/, '').toLowerCase();
    if (normalized && !currentTags.includes(normalized)) {
      pushValue(normalized);
    }
    setCurrentTag('');
  };

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
        {!hideTypeSelection && (
          <form.Field name='type'>
            {(field) => {
              const errors = getFieldError(field.name, field.state.meta.errors);
              const isInvalid = errors.length > 0;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>
                    Post Type <span className='text-destructive'>*</span>
                  </FieldLabel>
                  <Select
                    value={field.state.value || 'announcement'}
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
                    disabled={!!initialValues}
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
                  {isInvalid && <FieldError errors={errors} />}
                </Field>
              );
            }}
          </form.Field>
        )}

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
                {(field) => {
                  const errors = getFieldError(field.name, field.state.meta.errors);
                  const isInvalid = errors.length > 0;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>
                        Title {isRequired && <span className='text-destructive'>*</span>}
                      </FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value || ''}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder='Enter title'
                      />
                      {isInvalid && <FieldError errors={errors} />}
                    </Field>
                  );
                }}
              </form.Field>
            );
          }}
        />

        {/* Content Field */}
        <form.Field name='content'>
          {(field) => {
            const errors = getFieldError(field.name, field.state.meta.errors);
            const isInvalid = errors.length > 0;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>
                  Content <span className='text-destructive'>*</span>
                </FieldLabel>
                <Textarea
                  id={field.name}
                  name={field.name}
                  value={field.state.value || ''}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className='min-h-[100px]'
                  placeholder='Share with your class...'
                />
                {isInvalid && <FieldError errors={errors} />}
              </Field>
            );
          }}
        </form.Field>

        <form.Subscribe
          selector={(state) => state.values.type}
          children={(type) =>
            type === 'material' ? (
              <form.Field name='tags' mode='array'>
                {(field) => (
                  <Field>
                    <FieldLabel htmlFor='resource-tag-input'>Tags</FieldLabel>
                    <div className='space-y-3'>
                      <div className='flex gap-2'>
                        <Input
                          id='resource-tag-input'
                          value={currentTag}
                          placeholder='Add tag and press Enter'
                          onChange={(e) => setCurrentTag(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddTag(field.pushValue, field.state.value);
                            }
                          }}
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

                      {field.state.value.length > 0 && (
                        <div className='flex flex-wrap gap-2'>
                          {field.state.value.map((tag, index) => (
                            <Badge key={`${tag}-${index}`} variant='secondary'>
                              #{tag}
                              <button
                                type='button'
                                className='ml-1 rounded-full p-0.5 hover:bg-muted-foreground/20'
                                onClick={() => field.removeValue(index)}
                              >
                                <X className='h-3 w-3' />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </Field>
                )}
              </form.Field>
            ) : null
          }
        />

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
                                  !field.state.value && 'text-muted-foreground',
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
                          value={field.state.value ?? ''}
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
                          value={field.state.value || 'file'}
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
                        checked={!!field.state.value}
                        onCheckedChange={(checked) =>
                          field.handleChange(!!checked)
                        }
                      />
                      <Label
                        htmlFor='late-submission'
                        className='font-normal text-sm'
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
          attachments={attachments}
          onAttachmentsChange={setAttachments}
          onUpload={async (file, onProgress) => {
            return uploadFile({
              classroomId,
              file,
              onProgress,
            });
          }}
          onRemove={async (id) => {
            await postService.removeAttachment(classroomId, id);
          }}
        />

        {/* Footer Options */}
        <div className='flex flex-col gap-3 pt-2'>
          <form.Field name='isPinned'>
            {(field) => (
              <div className='flex items-center space-x-2'>
                <Checkbox
                  id='pinned'
                  checked={!!field.state.value}
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
                  checked={!!field.state.value}
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

      {globalErrors.length > 0 && (
        <Alert variant='destructive'>
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {globalErrors.map((err, i) => (
              <p key={i}>{err.message}</p>
            ))}
          </AlertDescription>
        </Alert>
      )}

      <div className='flex justify-end gap-2'>
        <form.Subscribe
          selector={(state) => [state.isSubmitting]}
          children={([isSubmitting]) => (
            <Button type='submit' disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : submitLabel}
            </Button>
          )}
        />
      </div>
    </form>
  );
}
