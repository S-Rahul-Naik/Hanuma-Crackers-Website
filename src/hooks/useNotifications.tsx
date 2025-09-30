import { createContext, useContext, useState, useEffect } from 'react';

const API_URL = process.env.REACT_APP_API_URL || import.meta.env.VITE_API_URL;
import type { ReactNode } from 'react';

interface Notification {
  id: string;
  type: 'receipt' | 'order' | 'general';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  orderId?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
  triggerReceiptNotification: (orderNumber: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Request browser notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then((permission) => {
        console.log('Notification permission:', permission);
        if (permission === 'granted') {
          console.log('Notifications enabled');
        }
      });
    }
  }, []);

  // Poll for new payment receipts every 10 seconds (reduced for testing)
  useEffect(() => {
    const checkForNewReceipts = async () => {
      try {
        console.log('Checking for new receipts...');
  const response = await fetch(`${API_URL}/api/admin/orders-with-receipts`, {
          credentials: 'include'
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log('Receipt data received:', data);
          const pendingReceipts = data.orders?.filter((order: any) => 
            order.paymentStatus === 'pending' && order.paymentReceipt
          ) || [];

          console.log('Pending receipts count:', pendingReceipts.length);

          // Check if there are new receipts
          const storedCount = localStorage.getItem('lastReceiptCount');
          const currentCount = pendingReceipts.length;

          console.log('Stored count:', storedCount, 'Current count:', currentCount);

          if (storedCount && parseInt(storedCount) < currentCount) {
            const newReceiptCount = currentCount - parseInt(storedCount);
            console.log('New receipts found:', newReceiptCount);
            addNotification({
              type: 'receipt',
              title: 'New Payment Receipt',
              message: `${newReceiptCount} new payment receipt${newReceiptCount > 1 ? 's' : ''} awaiting verification`
            });
          }

          localStorage.setItem('lastReceiptCount', currentCount.toString());
        } else {
          console.error('Failed to fetch receipts:', response.status);
        }
      } catch (error) {
        console.error('Error checking for new receipts:', error);
      }
    };

    // Initial check after a short delay
    const initialTimer = setTimeout(() => {
      checkForNewReceipts();
    }, 2000);

    // Set up polling every 10 seconds
    const interval = setInterval(checkForNewReceipts, 10000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, []);

  const addNotification = (notificationData: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const notification: Notification = {
      ...notificationData,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false
    };

    console.log('Adding notification:', notification);
    setNotifications(prev => [notification, ...prev]);

    // Show browser notification
    if ('Notification' in window && Notification.permission === 'granted') {
      console.log('Showing browser notification');
      const browserNotification = new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico',
        tag: notification.type,
        requireInteraction: true // Keep notification visible until clicked
      });

      // Auto-close after 5 seconds if not clicked
      setTimeout(() => {
        browserNotification.close();
      }, 5000);
    } else {
      console.log('Browser notifications not available or not permitted');
    }

    // Play notification sound
    playNotificationSound();
  };

  const playNotificationSound = () => {
    try {
      console.log('Playing notification sound');
      
      // Create audio context with user interaction handling
      let audioContext: AudioContext;
      
      try {
        audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      } catch (e) {
        console.error('Could not create audio context:', e);
        return;
      }

      // If audio context is suspended, try to resume it
      if (audioContext.state === 'suspended') {
        audioContext.resume().then(() => {
          console.log('Audio context resumed');
          playSound(audioContext);
        }).catch(() => {
          console.log('Could not resume audio context');
        });
      } else {
        playSound(audioContext);
      }

    } catch (error) {
      console.error('Could not play notification sound:', error);
    }
  };

  const playSound = (audioContext: AudioContext) => {
    try {
      // Create a more pleasant notification sound
      const oscillator1 = audioContext.createOscillator();
      const oscillator2 = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator1.connect(gainNode);
      oscillator2.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Set frequencies for a pleasant chord (C major)
      oscillator1.frequency.value = 523.25; // C5
      oscillator2.frequency.value = 659.25; // E5
      oscillator1.type = 'sine';
      oscillator2.type = 'sine';
      
      // Set volume and envelope
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.2, audioContext.currentTime + 0.1);
      gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.5);
      
      // Play the sound
      const now = audioContext.currentTime;
      oscillator1.start(now);
      oscillator2.start(now);
      oscillator1.stop(now + 0.5);
      oscillator2.stop(now + 0.5);
      
      console.log('Notification sound played successfully');
      
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const triggerReceiptNotification = (orderNumber: string) => {
    addNotification({
      type: 'receipt',
      title: 'Payment Receipt Uploaded',
      message: `New payment receipt for order ${orderNumber} requires verification`,
      orderId: orderNumber
    });
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      addNotification,
      markAsRead,
      markAllAsRead,
      clearNotifications,
      triggerReceiptNotification
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}