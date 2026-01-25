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

/**
 * Converts an absolute API URL to a relative path to support Next.js rewrites
 * and hide the backend API address from the end user.
 */
export function getProxiedUrl(url: string | undefined) {
  if (!url) return '';

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

  if (url.startsWith(apiUrl)) {
    return url.replace(apiUrl, '');
  }

  return url;
}
