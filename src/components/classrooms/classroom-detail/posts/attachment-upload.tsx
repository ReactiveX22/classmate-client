import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import {
  UploadResult,
  useUploadAttachment,
} from '@/hooks/use-upload-attachment';
import { cn } from '@/lib/utils';
import {
  IconFile,
  IconFileText,
  IconLink,
  IconPaperclip,
  IconPhoto,
  IconTrash,
  IconVideo,
  IconX,
} from '@tabler/icons-react';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';

interface FileUploadState {
  file: File;
  progress: number;
  status: 'uploading' | 'success' | 'error';
  result?: UploadResult;
  error?: string;
}

interface AttachmentUploadProps {
  classroomId: string;
  attachments: UploadResult[];
  onAttachmentsChange: (attachments: UploadResult[]) => void;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'text/plain',
  'application/zip',
];

export function AttachmentUpload({
  classroomId,
  attachments,
  onAttachmentsChange,
}: AttachmentUploadProps) {
  const [uploads, setUploads] = useState<FileUploadState[]>([]);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkName, setLinkName] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const { mutateAsync: uploadFile } = useUploadAttachment();

  const validateFile = (file: File): string | null => {
    if (file.size > MAX_FILE_SIZE) {
      return 'File is too large. Maximum size is 10MB';
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      return 'File type not allowed';
    }
    return null;
  };

  const handleUpload = useCallback(
    async (files: File[]) => {
      const validFiles: File[] = [];

      for (const file of files) {
        const error = validateFile(file);
        if (error) {
          toast.error(`${file.name}: ${error}`);
          continue;
        }
        validFiles.push(file);
      }

      if (validFiles.length === 0) return;

      const newUploads: FileUploadState[] = validFiles.map((file) => ({
        file,
        progress: 0,
        status: 'uploading' as const,
      }));

      setUploads((prev) => [...prev, ...newUploads]);

      for (let i = 0; i < validFiles.length; i++) {
        const file = validFiles[i];
        const uploadIndex = uploads.length + i;

        try {
          const result = await uploadFile({
            classroomId,
            file,
            onProgress: (progress: number) => {
              setUploads((prev) => {
                const updated = [...prev];
                if (updated[uploadIndex]) {
                  updated[uploadIndex].progress = progress;
                }
                return updated;
              });
            },
          });

          setUploads((prev) => {
            const updated = [...prev];
            if (updated[uploadIndex]) {
              updated[uploadIndex].status = 'success';
              updated[uploadIndex].result = result;
            }
            return updated;
          });

          onAttachmentsChange([...attachments, result]);
        } catch (error) {
          setUploads((prev) => {
            const updated = [...prev];
            if (updated[uploadIndex]) {
              updated[uploadIndex].status = 'error';
              updated[uploadIndex].error =
                error instanceof Error ? error.message : 'Upload failed';
            }
            return updated;
          });
        }
      }
    },
    [classroomId, uploadFile, attachments, onAttachmentsChange, uploads.length]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files);
      handleUpload(files);
    },
    [handleUpload]
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleUpload(files);
    }
  };

  const removeUpload = (index: number) => {
    setUploads((prev) => prev.filter((_, i) => i !== index));
  };

  const removeAttachment = (id: string) => {
    onAttachmentsChange(attachments.filter((a) => a.id !== id));
  };

  const addLink = () => {
    if (!linkUrl.trim()) {
      toast.error('Please enter a URL');
      return;
    }

    try {
      new URL(linkUrl);
    } catch {
      toast.error('Please enter a valid URL');
      return;
    }

    const linkAttachment: UploadResult = {
      id: `link-${Date.now()}`,
      name: linkName.trim() || linkUrl,
      url: linkUrl,
      type: 'link',
      size: 0,
      mimeType: 'text/uri-list',
    };

    onAttachmentsChange([...attachments, linkAttachment]);
    setLinkUrl('');
    setLinkName('');
    setShowLinkInput(false);
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <IconPhoto className='h-5 w-5' />;
    if (type.startsWith('video/')) return <IconVideo className='h-5 w-5' />;
    if (type === 'application/pdf') return <IconFileText className='h-5 w-5' />;
    if (type === 'link') return <IconLink className='h-5 w-5' />;
    return <IconFile className='h-5 w-5' />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  return (
    <div className='space-y-4'>
      <Label className='text-muted-foreground'>Attachments</Label>

      {/* Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        className={cn(
          'border-2 border-dashed rounded-lg p-6 transition-colors',
          isDragging
            ? 'border-primary bg-primary/5'
            : 'border-border bg-muted/10'
        )}
      >
        <div className='flex flex-col items-center justify-center text-center gap-4'>
          <IconPaperclip className='h-8 w-8 text-muted-foreground' />
          <div>
            <p className='text-sm font-medium'>
              Drag and drop files here, or click to browse
            </p>
            <p className='text-xs text-muted-foreground mt-1'>
              Max 10MB • JPG, PNG, PDF, DOC, XLS, PPT, TXT, ZIP
            </p>
          </div>
          <div className='flex gap-2'>
            <Button
              type='button'
              variant='outline'
              size='sm'
              onClick={() => document.getElementById('file-input')?.click()}
            >
              Browse Files
            </Button>
            <Button
              type='button'
              variant='outline'
              size='sm'
              onClick={() => setShowLinkInput(true)}
            >
              <IconLink className='h-4 w-4 mr-2' />
              Add Link
            </Button>
          </div>
          <input
            id='file-input'
            type='file'
            multiple
            onChange={handleFileInput}
            className='hidden'
            accept={ALLOWED_TYPES.join(',')}
          />
        </div>
      </div>

      {/* Link Input */}
      {showLinkInput && (
        <div className='border rounded-lg p-4 space-y-3 bg-muted/20'>
          <div className='flex items-center justify-between'>
            <h4 className='font-medium text-sm'>Add Link</h4>
            <Button
              type='button'
              variant='ghost'
              size='sm'
              onClick={() => setShowLinkInput(false)}
            >
              <IconX className='h-4 w-4' />
            </Button>
          </div>
          <div className='space-y-2'>
            <input
              type='url'
              placeholder='https://example.com'
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              className='w-full px-3 py-2 border rounded-md text-sm'
            />
            <input
              type='text'
              placeholder='Link name (optional)'
              value={linkName}
              onChange={(e) => setLinkName(e.target.value)}
              className='w-full px-3 py-2 border rounded-md text-sm'
            />
            <Button type='button' size='sm' onClick={addLink}>
              Add Link
            </Button>
          </div>
        </div>
      )}

      {/* Uploading Files */}
      {uploads.length > 0 && (
        <div className='space-y-2'>
          {uploads.map((upload, index) => (
            <div
              key={index}
              className='border rounded-lg p-3 bg-background space-y-2'
            >
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2 flex-1 min-w-0'>
                  {getFileIcon(upload.file.type)}
                  <div className='flex-1 min-w-0'>
                    <p className='text-sm font-medium truncate'>
                      {upload.file.name}
                    </p>
                    <p className='text-xs text-muted-foreground'>
                      {formatFileSize(upload.file.size)}
                    </p>
                  </div>
                </div>
                <Button
                  type='button'
                  variant='ghost'
                  size='sm'
                  onClick={() => removeUpload(index)}
                >
                  <IconX className='h-4 w-4' />
                </Button>
              </div>
              {upload.status === 'uploading' && (
                <Progress value={upload.progress} className='h-1' />
              )}
              {upload.status === 'error' && (
                <p className='text-xs text-red-500'>{upload.error}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Uploaded Attachments */}
      {attachments.length > 0 && (
        <div className='space-y-2'>
          <Label className='text-sm'>Attached ({attachments.length})</Label>
          {attachments.map((attachment) => (
            <div
              key={attachment.id}
              className='border rounded-lg p-3 bg-background flex items-center justify-between'
            >
              <div className='flex items-center gap-2 flex-1 min-w-0'>
                {getFileIcon(
                  attachment.type === 'link' ? 'link' : attachment.mimeType
                )}
                <div className='flex-1 min-w-0'>
                  <p className='text-sm font-medium truncate'>
                    {attachment.name}
                  </p>
                  {attachment.size > 0 && (
                    <p className='text-xs text-muted-foreground'>
                      {formatFileSize(attachment.size)}
                    </p>
                  )}
                </div>
              </div>
              <Button
                type='button'
                variant='ghost'
                size='sm'
                onClick={() => removeAttachment(attachment.id)}
              >
                <IconTrash className='h-4 w-4 text-destructive' />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
