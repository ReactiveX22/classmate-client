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
  } catch {
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

export async function copyToClipboard(text: string) {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    throw new Error('Clipboard API is not available');
  }

  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  textarea.style.pointerEvents = 'none';
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();

  const copied = document.execCommand('copy');
  document.body.removeChild(textarea);

  if (!copied) {
    throw new Error('Copy command failed');
  }
}
