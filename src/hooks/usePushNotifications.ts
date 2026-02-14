'use client';

import { useState, useEffect } from 'react';
import { requestNotificationPermission, onMessageListener } from '@/lib/firebase.config';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

export function usePushNotifications() {
  const { data: session } = useSession();
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [loading, setLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermission(Notification.permission);
      
      // Check if we already have a subscription in local storage or logic
      // Ideally we would check with backend, but checking permission is a good start
      if (Notification.permission === 'granted') {
        setIsSubscribed(true);
      }
    }
  }, []);

  // Listen for incoming messages when app is in foreground
  useEffect(() => {
    if (permission === 'granted') {
      const unsubscribe = onMessageListener().then((payload) => {
        if (payload) {
          console.log('Foreground notification received:', payload);
          toast(payload.notification?.title || 'New Notification', {
            description: payload.notification?.body,
          });
        }
      });
      
      return () => {
        // Cleanup if needed
      };
    }
  }, [permission]);

  const subscribe = async () => {
    if (!session?.user) {
      toast.error('Please login to subscribe to notifications');
      return;
    }

    setLoading(true);
    try {
      const token = await requestNotificationPermission();
      
      if (token) {
        // Send token to backend
        const response = await fetch('/api/push/subscribe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });

        if (response.ok) {
          setPermission('granted');
          setIsSubscribed(true);
          toast.success('Successfully subscribed to notifications!');
        } else {
          console.error('Failed to save subscription on server');
          toast.error('Failed to enable notifications');
        }
      } else {
        setPermission(Notification.permission);
        if (Notification.permission === 'denied') {
          toast.error('Permission denied. Please enable notifications in your browser settings.');
        }
      }
    } catch (error) {
      console.error('Error subscribing:', error);
      toast.error('An error occurred while subscribing');
    } finally {
      setLoading(false);
    }
  };

  const unsubscribe = async () => {
    // In a real app we would get the current token and send to backend to delete
    // For now we'll just show a message as unregistering SW token is complex
    toast.info('To unsubscribe, please block notifications in your browser settings');
  };

  const sendTestNotification = async () => {
    if (!isSubscribed) return;
    
    try {
      const response = await fetch('/api/push/test', {
        method: 'POST',
      });
      
      if (response.ok) {
        toast.success('Test notification sent!');
      } else {
        toast.error('Failed to send test notification');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error sending test notification');
    }
  };

  return {
    permission,
    loading,
    isSubscribed,
    subscribe,
    unsubscribe,
    sendTestNotification
  };
}
