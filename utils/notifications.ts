import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { ROUTINE_CATEGORY } from "./notificationsCategories";

import AsyncStorage from "@react-native-async-storage/async-storage";

export const NOTIFICATIONS_KEY = "notificationsEnabled";

export const areNotificationsEnabled = async (): Promise<boolean> => {
  const v = await AsyncStorage.getItem(NOTIFICATIONS_KEY);
  return v === "true";
};

// Configure notification handler (foreground behavior)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Ask for notification permissions
export const requestPermissions = async () => {
  const settings = await Notifications.getPermissionsAsync();

  if (settings.granted) return true;
  if (Constants.isDevice) {
    const { status } = await Notifications.requestPermissionsAsync();
    return status === "granted";
  } else {
    console.warn("Must use physical device for notifications");
    return false;
  }
};

// Schedule a notification
export const scheduleNotification = async (
  title: string,
  body: string,
  date: Date,
  routineId: string,
  type: string,
  icon: string = ""
) => {
  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      subtitle: type.toUpperCase(),
      sound: "default",
      categoryIdentifier: ROUTINE_CATEGORY,
      color: "#2F3A36",
      data: {
        routineId,
        icon
      },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date,
    },
  });
  return id;
};

// Cancel notification by ID
export const cancelNotification = async (id: string) => {
  await Notifications.cancelScheduledNotificationAsync(id);
};

// Notification channel setup for Android
export const setupAndroidNotificationChannel = async () => {
  if (Platform.OS !== "android") return;

  await Notifications.setNotificationChannelAsync("default", {
    name: "Nudges",
    importance: Notifications.AndroidImportance.HIGH, // High shows banner, Max makes noise
    vibrationPattern: [0, 250, 250, 250],
    lightColor: "#2F3A36",
  });
};
