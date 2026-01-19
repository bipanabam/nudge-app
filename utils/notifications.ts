import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import { ROUTINE_CATEGORY } from "./notificationsCategories";

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
) => {
  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: "default",
      categoryIdentifier: ROUTINE_CATEGORY,
      data: {
        routineId,
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
