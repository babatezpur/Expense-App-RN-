import { useEffect, useCallback } from 'react';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { useExpenses } from '../context/ExpenseContext';
import { useExpenseAnalytics } from './useExpenseAnalytics';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export function useNotifications() {
  const { settings, updateSettings } = useExpenses();
  const analytics = useExpenseAnalytics();

  const requestPermissions = useCallback(async () => {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        return false;
      }

      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('daily-reminders', {
          name: 'Daily Spending Reminders',
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#007AFF',
        });
      }

      return true;
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
      return false;
    }
  }, []);

  const scheduleDaily10PMNotification = useCallback(async () => {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();

      if (!settings.notificationsEnabled) {
        return;
      }

      const hasPermission = await requestPermissions();
      if (!hasPermission) {
        return;
      }

      const now = new Date();
      const scheduledTime = new Date();
      scheduledTime.setHours(22, 0, 0, 0);

      if (scheduledTime <= now) {
        scheduledTime.setDate(scheduledTime.getDate() + 1);
      }

      const notificationContent = {
        title: 'Daily Spending Summary',
        body: getNotificationMessage(),
        sound: 'default',
        priority: Notifications.AndroidNotificationPriority.HIGH,
      };

      await Notifications.scheduleNotificationAsync({
        content: notificationContent,
        trigger: {
          hour: 22,
          minute: 0,
          repeats: true,
        },
      });

    } catch (error) {
      console.error('Error scheduling notification:', error);
    }
  }, [settings.notificationsEnabled, analytics.totalToday, analytics.totalYesterday, requestPermissions]);

  const getNotificationMessage = useCallback(() => {
    const todayAmount = analytics.totalToday;
    const yesterdayAmount = analytics.totalYesterday;

    if (todayAmount === 0) {
      return 'Great job! You didn\'t spend anything today 🎉';
    }

    if (yesterdayAmount === 0) {
      return `You spent ₹${todayAmount.toFixed(2)} today.`;
    }

    if (todayAmount > yesterdayAmount) {
      const difference = todayAmount - yesterdayAmount;
      return `You spent ₹${todayAmount.toFixed(2)} today, ₹${difference.toFixed(2)} more than yesterday (₹${yesterdayAmount.toFixed(2)}).`;
    } else if (todayAmount < yesterdayAmount) {
      const difference = yesterdayAmount - todayAmount;
      return `You spent ₹${todayAmount.toFixed(2)} today, ₹${difference.toFixed(2)} less than yesterday (₹${yesterdayAmount.toFixed(2)}). Great job! 👏`;
    } else {
      return `You spent ₹${todayAmount.toFixed(2)} today, same as yesterday.`;
    }
  }, [analytics.totalToday, analytics.totalYesterday]);

  const enableNotifications = useCallback(async () => {
    const hasPermission = await requestPermissions();
    if (hasPermission) {
      updateSettings({ notificationsEnabled: true });
      return true;
    }
    return false;
  }, [requestPermissions, updateSettings]);

  const disableNotifications = useCallback(async () => {
    await Notifications.cancelAllScheduledNotificationsAsync();
    updateSettings({ notificationsEnabled: false });
  }, [updateSettings]);

  const testNotification = useCallback(async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      return false;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Test Notification',
        body: getNotificationMessage(),
        sound: 'default',
      },
      trigger: {
        seconds: 1,
      },
    });

    return true;
  }, [getNotificationMessage, requestPermissions]);

  useEffect(() => {
    if (settings.notificationsEnabled) {
      scheduleDaily10PMNotification();
    }
  }, [settings.notificationsEnabled, scheduleDaily10PMNotification]);

  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received:', notification);
    });

    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification response:', response);
    });

    return () => {
      subscription.remove();
      responseListener.remove();
    };
  }, []);

  return {
    requestPermissions,
    enableNotifications,
    disableNotifications,
    testNotification,
    isEnabled: settings.notificationsEnabled,
  };
}