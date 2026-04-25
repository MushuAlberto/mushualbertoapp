import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface NotificationContent {
  title: string;
  body: string;
  timestamp: string;
  type: 'reminder' | 'motivation' | 'wellbeing' | 'achievement' | 'general';
  priority: 'low' | 'medium' | 'high';
}

interface IntelligentNotification {
  notification: NotificationContent;
  optimalTiming: string;
  suggestions: {
    frequency: string;
  };
}

interface NotificationPreferences {
  enableReminders: boolean;
  enableMotivation: boolean;
  enableWellbeing: boolean;
  enableAchievements: boolean;
  quietHoursStart?: number;
  quietHoursEnd?: number;
  frequency: 'minimal' | 'moderate' | 'frequent';
}

export const useIntelligentNotifications = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastNotification, setLastNotification] = useState<NotificationContent | null>(null);
  const [notificationQueue, setNotificationQueue] = useState<IntelligentNotification[]>([]);
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    enableReminders: true,
    enableMotivation: true,
    enableWellbeing: true,
    enableAchievements: true,
    quietHoursStart: 22,
    quietHoursEnd: 8,
    frequency: 'moderate',
  });
  const { toast } = useToast();

  // Load preferences from localStorage
  useEffect(() => {
    const savedPrefs = localStorage.getItem('notification_preferences');
    if (savedPrefs) {
      setPreferences(JSON.parse(savedPrefs));
    }
  }, []);

  // Save preferences to localStorage
  const updatePreferences = useCallback((newPrefs: Partial<NotificationPreferences>) => {
    const updated = { ...preferences, ...newPrefs };
    setPreferences(updated);
    localStorage.setItem('notification_preferences', JSON.stringify(updated));
  }, [preferences]);

  const isQuietHours = useCallback(() => {
    const currentHour = new Date().getHours();
    const { quietHoursStart = 22, quietHoursEnd = 8 } = preferences;
    
    if (quietHoursStart > quietHoursEnd) {
      return currentHour >= quietHoursStart || currentHour < quietHoursEnd;
    }
    return currentHour >= quietHoursStart && currentHour < quietHoursEnd;
  }, [preferences]);

  const generateNotification = useCallback(async (
    notificationType: 'reminder' | 'motivation' | 'wellbeing' | 'achievement' | 'general',
    context: any = {},
    userProfile: any = {},
    recentActivities: any[] = []
  ): Promise<IntelligentNotification | null> => {
    // Check if this notification type is enabled
    const typeEnabled = {
      reminder: preferences.enableReminders,
      motivation: preferences.enableMotivation,
      wellbeing: preferences.enableWellbeing,
      achievement: preferences.enableAchievements,
      general: true,
    };

    if (!typeEnabled[notificationType]) {
      console.log(`Notification type ${notificationType} is disabled`);
      return null;
    }

    // Check quiet hours
    if (isQuietHours() && notificationType !== 'achievement') {
      console.log('Quiet hours active, skipping notification');
      return null;
    }

    setIsGenerating(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('intelligent-notifications', {
        body: {
          userProfile,
          recentActivities,
          notificationType,
          context
        }
      });

      if (error) {
        console.error('Error generating notification:', error);
        throw error;
      }

      const notification = data as IntelligentNotification;
      setLastNotification(notification.notification);
      
      return notification;
    } catch (error) {
      console.error('Error generating intelligent notification:', error);
      // Return a fallback notification
      return {
        notification: {
          title: '🔔 Recordatorio',
          body: '¡Recuerda tomarte un momento para ti! 💙',
          timestamp: new Date().toISOString(),
          type: notificationType,
          priority: 'low'
        },
        optimalTiming: 'now',
        suggestions: { frequency: 'flexible' }
      };
    } finally {
      setIsGenerating(false);
    }
  }, [preferences, isQuietHours]);

  const showNotification = useCallback((notification: NotificationContent) => {
    // Browser notification if permission granted
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.body,
        icon: '/lovable-uploads/380c9afd-cc09-49ed-81e6-032d02dc9a6c.png',
        badge: '/lovable-uploads/380c9afd-cc09-49ed-81e6-032d02dc9a6c.png',
      });
    }

    // In-app toast notification
    toast({
      title: notification.title,
      description: notification.body,
      duration: 5000,
    });

    setLastNotification(notification);
  }, [toast]);

  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      toast({
        title: "No soportado",
        description: "Tu navegador no soporta notificaciones",
        variant: "destructive",
      });
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    const permission = await Notification.requestPermission();
    
    if (permission === 'granted') {
      toast({
        title: "✅ Notificaciones activadas",
        description: "Recibirás recordatorios personalizados",
      });
      return true;
    } else {
      toast({
        title: "Notificaciones desactivadas",
        description: "No recibirás recordatorios del navegador",
      });
      return false;
    }
  }, [toast]);

  const scheduleNotification = useCallback(async (
    notificationType: 'reminder' | 'motivation' | 'wellbeing' | 'achievement',
    context: any = {}
  ) => {
    const notification = await generateNotification(notificationType, context);
    if (notification) {
      setNotificationQueue(prev => [...prev, notification]);
    }
  }, [generateNotification]);

  const sendReminder = useCallback(async (task: string) => {
    const notification = await generateNotification('reminder', { task });
    if (notification) {
      showNotification(notification.notification);
    }
  }, [generateNotification, showNotification]);

  const sendMotivation = useCallback(async (recentActivities: any[] = []) => {
    const notification = await generateNotification('motivation', {}, {}, recentActivities);
    if (notification) {
      showNotification(notification.notification);
    }
  }, [generateNotification, showNotification]);

  const sendWellbeingReminder = useCallback(async () => {
    const notification = await generateNotification('wellbeing', {});
    if (notification) {
      showNotification(notification.notification);
    }
  }, [generateNotification, showNotification]);

  const celebrateAchievement = useCallback(async (achievement: string) => {
    const notification = await generateNotification('achievement', { achievement });
    if (notification) {
      showNotification(notification.notification);
    }
  }, [generateNotification, showNotification]);

  return {
    isGenerating,
    lastNotification,
    notificationQueue,
    preferences,
    updatePreferences,
    generateNotification,
    showNotification,
    requestPermission,
    scheduleNotification,
    sendReminder,
    sendMotivation,
    sendWellbeingReminder,
    celebrateAchievement,
    isQuietHours,
  };
};
