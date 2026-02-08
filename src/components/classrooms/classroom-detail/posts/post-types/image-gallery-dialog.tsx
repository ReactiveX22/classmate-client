'use client';

import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { Attachment } from '@/lib/api/services/post.service';
import { getProxiedUrl } from '@/lib/utils';
import { X } from 'lucide-react';
import Image from 'next/image';

interface ImageGalleryDialogProps {
  images: Attachment[];
  initialIndex?: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
export function ImageGalleryDialog({
  images,
  initialIndex = 0,
  open,
  onOpenChange,
}: ImageGalleryDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* 1. Ensure DialogContent has a height and width */}
      <DialogContent
        showCloseButton={false}
        className='max-w-5xl w-[95vw] h-[95vh] p-0 flex flex-col justify-center shadow-none border-none rounded-none bg-transparent'
      >
        <DialogClose className='absolute top-4 right-4 z-10 rounded-full bg-background/40 p-2'>
          <X className='size-4' />
          <span className='sr-only'>Close</span>
        </DialogClose>
        <DialogTitle className='sr-only'>Image Gallery</DialogTitle>

        <Carousel
          opts={{ startIndex: initialIndex, loop: true }}
          className='w-full h-full'
        >
          <CarouselContent className='h-full'>
            {images.map((image) => (
              <CarouselItem
                key={image.id}
                className='h-full flex items-center justify-center'
              >
                {/* 2. Parent MUST be relative + have a defined height for 'fill' to work */}
                <div className='relative w-full h-full'>
                  <Image
                    src={getProxiedUrl(image.url)}
                    alt={image.name}
                    fill
                    unoptimized
                    className='object-contain'
                    sizes='100vw'
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious className='left-4 opacity-100' />
          <CarouselNext className='right-4 opacity-100' />
        </Carousel>
      </DialogContent>
    </Dialog>
  );
}
