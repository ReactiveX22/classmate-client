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
      <DialogContent className='absolute max-w-full h-full top-0 -translate-x-1/2 translate-y-0 p-0 border-none sm:rounded-none'>
        <DialogClose
          className='pointer-events-auto'
          render={
            <Button
              variant='ghost'
              className='absolute top-4 right-4'
              size='icon-sm'
            />
          }
        >
          <X />
          <span className='sr-only'>Close</span>
        </DialogClose>
        <DialogTitle className='sr-only'>Image Gallery</DialogTitle>
        <Carousel
          opts={{
            startIndex: initialIndex,
            loop: true,
          }}
          className='w-full h-full fixed'
        >
          <CarouselContent className='h-full'>
            {images.map((image) => (
              <CarouselItem
                key={image.id}
                className='flex items-center justify-center h-full'
              >
                <div className='relative w-full h-full'>
                  <Image
                    src={getProxiedUrl(image.url)}
                    alt={image.name}
                    fill
                    unoptimized
                    className='object-scale-down'
                    sizes='100vw'
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious className='left-4' />
          <CarouselNext className='right-4' />
        </Carousel>
      </DialogContent>
    </Dialog>
  );
}
