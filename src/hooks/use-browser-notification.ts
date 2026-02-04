'use client';

import { useCallback } from 'react';

export const useBrowserNotification = () => {
  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) return 'unsupported';
    if (Notification.permission === 'granted') return 'granted';

    return await Notification.requestPermission();
  }, []);

  const sendBrowserNotification = useCallback(
    (title: string, options?: NotificationOptions) => {
      if (
        typeof window !== 'undefined' &&
        'Notification' in window &&
        Notification.permission === 'granted' &&
        document.visibilityState === 'hidden'
      ) {
        return new Notification(title, {
          // icon: '/icons/icon-192x192.png', // Standard PWA icon path
          // badge: '/icons/badge.png',       // Android status bar icon
          ...options,
        });
      }
    },
    [],
  );

  return {
    requestPermission,
    sendBrowserNotification,
    permission:
      typeof window !== 'undefined' ? Notification.permission : 'default',
  };
};
