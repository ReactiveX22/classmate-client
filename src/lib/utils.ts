import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(
  date: Date | string | number | undefined,
  opts: Intl.DateTimeFormatOptions = {}
) {
  if (!date) return '';

  try {
    return new Intl.DateTimeFormat('en-US', {
      month: opts.month ?? 'long',
      day: opts.day ?? 'numeric',
      year: opts.year ?? 'numeric',
      ...opts,
    }).format(new Date(date));
  } catch (_err) {
    return '';
  }
}

export function getInitials(name: string | undefined) {
  if (!name) {
    return '';
  }

  const nameParts = name.split(' ');
  let initials = '';

  if (nameParts.length === 1) {
    initials = nameParts[0].charAt(0);
  } else {
    initials = nameParts[0].charAt(0) + nameParts[1].charAt(0);
  }

  return initials.toUpperCase();
}
