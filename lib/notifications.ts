/**
 * Notifications service for alarms
 * Handles scheduling and displaying notifications
 */

import * as Notifications from "expo-notifications";
import { Alarm } from "./types";

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const notificationsService = {
  async requestPermissions(): Promise<boolean> {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      return status === "granted";
    } catch (error) {
      console.error("Error requesting notification permissions:", error);
      return false;
    }
  },

  async scheduleAlarmNotification(alarm: Alarm): Promise<string | null> {
    try {
      const [hours, minutes] = alarm.time.split(":").map(Number);
      const triggerDate = new Date(alarm.date);
      triggerDate.setHours(hours, minutes, 0, 0);

      // If the time is in the past, don't schedule
      if (triggerDate < new Date()) {
        console.warn("Alarm time is in the past, not scheduling");
        return null;
      }

      const secondsUntilTrigger = Math.floor((triggerDate.getTime() - Date.now()) / 1000);

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: "Jarvis - Alarme",
          body: alarm.description,
          sound: true,
          badge: 1,
          data: {
            alarmId: alarm.id,
            type: "alarm",
          },
        },
        trigger: {
          type: "time-interval" as any,
        seconds: Math.max(1, secondsUntilTrigger),
        },
      });

      return notificationId;
    } catch (error) {
      console.error("Error scheduling alarm notification:", error);
      return null;
    }
  },

  async cancelNotification(notificationId: string): Promise<void> {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
    } catch (error) {
      console.error("Error canceling notification:", error);
    }
  },

  async cancelAllNotifications(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      console.error("Error canceling all notifications:", error);
    }
  },

  async getScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
    try {
      return await Notifications.getAllScheduledNotificationsAsync();
    } catch (error) {
      console.error("Error getting scheduled notifications:", error);
      return [];
    }
  },

  onNotificationReceived(callback: (notification: Notifications.Notification) => void) {
    return Notifications.addNotificationReceivedListener(callback);
  },

  onNotificationResponse(callback: (response: Notifications.NotificationResponse) => void) {
    return Notifications.addNotificationResponseReceivedListener(callback);
  },
};
