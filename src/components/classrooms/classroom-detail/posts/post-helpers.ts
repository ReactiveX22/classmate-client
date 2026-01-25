import {
  IconFileText,
  IconLink,
  IconPhoto,
  IconVideo,
} from '@tabler/icons-react';

/**
 * Get icon component based on attachment type
 */
export const getAttachmentIcon = (type: string) => {
  switch (type) {
    case 'video':
      return IconVideo;
    case 'image':
      return IconPhoto;
    case 'link':
      return IconLink;
    default:
      return IconFileText;
  }
};
