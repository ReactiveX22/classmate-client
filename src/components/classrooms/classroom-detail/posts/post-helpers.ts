import {
  IconFileText,
  IconLink,
  IconPhoto,
  IconVideo,
} from '@tabler/icons-react';

/**
 * Get initials from author name
 */
export const getAuthorInitials = (name?: string): string => {
  if (!name) return '?';
  const names = name.split(' ');
  return names.length >= 2
    ? `${names[0][0]}${names[names.length - 1][0]}`
    : names[0][0];
};

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
