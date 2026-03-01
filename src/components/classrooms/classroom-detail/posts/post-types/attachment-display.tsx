import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Attachment } from '@/lib/api/services/post.service';
import { cn, getProxiedUrl } from '@/lib/utils';
import {
  IconDownload,
  IconExternalLink,
  IconFile,
  IconFileText,
  IconLink,
  IconPhoto,
  IconVideo,
} from '@tabler/icons-react';
import Image from 'next/image';
import { useState } from 'react';
import { ImageGalleryDialog } from './image-gallery-dialog';

interface AttachmentDisplayProps {
  attachments: Attachment[];
  variant?: 'default' | 'compact';
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

/**
 * Truncate long file names while preserving the extension.
 * Example: "VeryLongFileName.pdf" -> "VeryLon...pdf"
 */
const truncateFileName = (name: string, maxLength: number = 30): string => {
  if (name.length <= maxLength) return name;

  const lastDotIndex = name.lastIndexOf('.');
  const hasExtension = lastDotIndex > 0 && lastDotIndex > name.length - 6;

  if (hasExtension) {
    const extension = name.slice(lastDotIndex);
    const baseName = name.slice(0, lastDotIndex);
    const availableLength = maxLength - extension.length - 3; // 3 for "..."

    if (availableLength > 5) {
      return baseName.slice(0, availableLength) + '...' + extension;
    }
  }

  return name.slice(0, maxLength - 3) + '...';
};

const getAttachmentIcon = (type: string, mimeType?: string) => {
  if (type === 'image') return IconPhoto;
  if (type === 'video') return IconVideo;
  if (type === 'link') return IconLink;
  if (mimeType?.includes('pdf')) return IconFileText;
  return IconFile;
};

const isImageFile = (attachment: Attachment) => {
  return (
    attachment.type === 'image' || attachment.mimeType?.startsWith('image/')
  );
};

const isVideoFile = (attachment: Attachment) => {
  return (
    attachment.type === 'video' || attachment.mimeType?.startsWith('video/')
  );
};

export function AttachmentDisplay({
  attachments,
  variant = 'default',
}: AttachmentDisplayProps) {
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const images = attachments.filter(isImageFile);
  const videos = attachments.filter(isVideoFile);
  const otherFiles = attachments.filter(
    (a) => !isImageFile(a) && !isVideoFile(a),
  );

  const handleImageError = (attachmentId: string) => {
    setImageErrors((prev) => new Set(prev).add(attachmentId));
  };

  const handleDownload = async (
    e: React.MouseEvent,
    attachment: Attachment,
  ) => {
    e.preventDefault();
    e.stopPropagation();

    if (attachment.type === 'link') {
      window.open(attachment.url, '_blank', 'noopener,noreferrer');
      return;
    }

    try {
      const response = await fetch(getProxiedUrl(attachment.url));
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = attachment.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      // Fallback
      window.open(getProxiedUrl(attachment.url), '_blank');
    }
  };

  if (variant === 'compact') {
    return (
      <div className='grid gap-2'>
        {attachments.map((attachment) => {
          const Icon = getAttachmentIcon(attachment.type, attachment.mimeType);
          const isLink = attachment.type === 'link';
          const isImage = isImageFile(attachment);
          const isVideo = isVideoFile(attachment);
          const isPdf = attachment.mimeType?.includes('pdf');

          return (
            <a
              key={attachment.id}
              href={getProxiedUrl(attachment.url)}
              target='_blank'
              rel='noopener noreferrer'
              className='flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 border rounded-lg hover:bg-muted/50 transition-colors group overflow-hidden'
            >
              <div
                className={cn(
                  'p-2 rounded-md transition-transform',
                  isLink && 'bg-blue-100 dark:bg-blue-950',
                  isPdf && 'bg-red-100 dark:bg-red-950',
                  isImage && 'bg-purple-100 dark:bg-purple-950',
                  isVideo && 'bg-pink-100 dark:bg-pink-950',
                  !isLink && !isPdf && !isImage && !isVideo && 'bg-muted',
                )}
              >
                <Icon
                  size={20}
                  className={cn(
                    isLink && 'text-blue-600 dark:text-blue-400',
                    isPdf && 'text-red-600 dark:text-red-400',
                    isImage && 'text-purple-600 dark:text-purple-400',
                    isVideo && 'text-pink-600 dark:text-pink-400',
                    !isLink &&
                      !isPdf &&
                      !isImage &&
                      !isVideo &&
                      'text-muted-foreground',
                  )}
                />
              </div>
              <div className='flex-1 min-w-0'>
                <p
                  className='text-xs sm:text-sm font-medium truncate group-hover:text-primary transition-colors'
                  title={attachment.name}
                >
                  {truncateFileName(attachment.name, 28)}
                </p>
                <div className='flex items-center gap-2 mt-0.5'>
                  {attachment.size !== undefined && attachment.size > 0 && (
                    <p className='text-xs text-muted-foreground'>
                      {formatFileSize(attachment.size)}
                    </p>
                  )}
                  {isLink && (
                    <Badge variant='secondary' className='text-[10px]'>
                      Link
                    </Badge>
                  )}
                  {isPdf && (
                    <Badge variant='secondary' className='text-[10px]'>
                      PDF
                    </Badge>
                  )}
                  {isImage && (
                    <Badge variant='secondary' className='text-[10px]'>
                      Image
                    </Badge>
                  )}
                  {isVideo && (
                    <Badge variant='secondary' className='text-[10px]'>
                      Video
                    </Badge>
                  )}
                </div>
              </div>
              <Button
                variant='ghost'
                size='icon-sm'
                className='opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity shrink-0'
                onClick={(e) => handleDownload(e, attachment)}
              >
                {isLink ? (
                  <IconExternalLink className='h-4 w-4' />
                ) : (
                  <IconDownload className='h-4 w-4' />
                )}
              </Button>
            </a>
          );
        })}
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      {/* Image Gallery */}
      {images.length > 0 && (
        <div
          className={cn(
            'grid gap-2 rounded-lg overflow-hidden',
            images.length === 1 && 'grid-cols-1',
            images.length === 2 && 'grid-cols-2',
            images.length === 3 && 'grid-cols-3',
            images.length >= 4 && 'grid-cols-2',
          )}
        >
          {images.slice(0, 4).map((image, index) => {
            const hasError = imageErrors.has(image.id);
            const isLastItem = index === 3 && images.length > 4;
            const remainingCount = images.length - 4;

            return (
              <div
                key={image.id}
                role='button'
                onClick={() => {
                  setSelectedImageIndex(index);
                  setIsGalleryOpen(true);
                }}
                className={cn(
                  'relative group overflow-hidden bg-muted rounded-md cursor-pointer',
                  images.length === 1 && 'aspect-video max-h-[400px]',
                  images.length === 2 && 'aspect-square',
                  images.length >= 3 && 'aspect-square',
                  'hover:opacity-95 transition-opacity',
                )}
              >
                {!hasError ? (
                  <Image
                    src={image.url}
                    alt={image.name}
                    fill
                    unoptimized
                    className='object-contain transition-all'
                    onError={() => handleImageError(image.id)}
                    sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                  />
                ) : (
                  <div className='w-full h-full flex items-center justify-center'>
                    <IconPhoto className='h-12 w-12 text-muted-foreground' />
                  </div>
                )}

                {/* Overlay for more images */}
                {isLastItem && remainingCount > 0 && (
                  <div className='absolute inset-0 bg-black/60 flex items-center justify-center'>
                    <span className='text-white text-2xl font-semibold'>
                      +{remainingCount}
                    </span>
                  </div>
                )}

                {/* Hover overlay - Only show if not the "+more" overlay to avoid overlap */}
                {(!isLastItem || remainingCount === 0) && (
                  <div className='absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100'>
                    {/* <IconExternalLink className='text-white h-6 w-6' /> */}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <ImageGalleryDialog
        images={images}
        initialIndex={selectedImageIndex}
        open={isGalleryOpen}
        onOpenChange={setIsGalleryOpen}
      />

      {/* Video Players */}
      {videos.length > 0 && (
        <div className='space-y-2'>
          {videos.map((video) => (
            <div key={video.id} className='rounded-lg overflow-hidden bg-black'>
              <video
                controls
                className='w-full max-h-[400px]'
                preload='metadata'
              >
                <source src={getProxiedUrl(video.url)} type={video.mimeType} />
                Your browser does not support the video tag.
              </video>
            </div>
          ))}
        </div>
      )}

      {/* Other Files & Links */}
      {otherFiles.length > 0 && (
        <div className='grid gap-2'>
          {otherFiles.map((attachment) => {
            const Icon = getAttachmentIcon(
              attachment.type,
              attachment.mimeType,
            );
            const isLink = attachment.type === 'link';
            const isPdf = attachment.mimeType?.includes('pdf');

            return (
              <a
                key={attachment.id}
                href={getProxiedUrl(attachment.url)}
                target='_blank'
                rel='noopener noreferrer'
                className='flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 border rounded-lg hover:bg-muted/50 transition-colors group overflow-hidden'
              >
                <div
                  className={cn(
                    'p-2 rounded-md group-hover:scale-105 transition-transform',
                    isLink && 'bg-blue-100 dark:bg-blue-950',
                    isPdf && 'bg-red-100 dark:bg-red-950',
                    !isLink && !isPdf && 'bg-muted',
                  )}
                >
                  <Icon
                    size={20}
                    className={cn(
                      isLink && 'text-blue-600 dark:text-blue-400',
                      isPdf && 'text-red-600 dark:text-red-400',
                      !isLink && !isPdf && 'text-muted-foreground',
                    )}
                  />
                </div>
                <div className='flex-1 min-w-0'>
                  <p
                    className='text-xs sm:text-sm font-medium truncate group-hover:text-primary transition-colors'
                    title={attachment.name}
                  >
                    {truncateFileName(attachment.name, 40)}
                  </p>
                  <div className='flex items-center gap-2 mt-0.5'>
                    {attachment.size !== undefined && attachment.size > 0 && (
                      <p className='text-xs text-muted-foreground'>
                        {formatFileSize(attachment.size)}
                      </p>
                    )}
                    {isLink && (
                      <Badge variant='secondary' className='text-[10px]'>
                        Link
                      </Badge>
                    )}
                    {isPdf && (
                      <Badge variant='secondary' className='text-[10px]'>
                        PDF
                      </Badge>
                    )}
                  </div>
                </div>
                <Button
                  variant='ghost'
                  size='icon-sm'
                  className='opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity cursor-pointer shrink-0'
                  onClick={(e) => handleDownload(e, attachment)}
                >
                  {isLink ? (
                    <IconExternalLink className='h-4 w-4' />
                  ) : (
                    <IconDownload className='h-4 w-4' />
                  )}
                </Button>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
