import { getRoutines } from "@/storage/routineStorage";
import { Routine } from "@/types/routine";
import {
  cancelNotification,
  requestPermissions,
  scheduleNotification,
} from "./notifications";

import { areNotificationsEnabled } from "@/utils/notifications";

// Helper: get next day occurrence
const getNextDayTime = (dayOfWeek: number, hour: number, minute: number) => {
  const now = new Date();
  const date = new Date(now);
  date.setHours(hour, minute, 0, 0);

  const diff = (dayOfWeek + 7 - date.getDay()) % 7;
  if (diff === 0 && date < now) date.setDate(date.getDate() + 7);
  else date.setDate(date.getDate() + diff);

  return date;
};

const getNotificationContent = (type: Routine["type"], name: string) => {
  const themes = {
    plant: {
      title: `Thirsty Plant? 🌱`,
      body: `${name} needs some love. Give it a quick water!`,
    },
    pet: {
      title: `Feeding Time 🐾`,
      body: `${name} is looking at their bowl! Time for breakfast/dinner.`,
    },
    laundry: {
      title: `Laundry Check 🧺`,
      body: `Time to move the ${name} load. Stay ahead of the pile!`,
    },
    trash: {
      title: `Trash Day 🗑️`,
      body: `Don't miss the pickup! Move ${name} to the curb.`,
    },
    default: { title: `Gentle Nudge`, body: `Time for your routine: ${name}` },
  };
  return themes[type] || themes.default;
};

export const scheduleRoutineNotifications = async (routine: Routine) => {
  const enabled = await areNotificationsEnabled();
  if (!enabled) return;

  const hasPermission = await requestPermissions();
  if (!hasPermission) return;

  // Cancel previous notification if exists
  if (routine.notificationIds?.length) {
    for (const id of routine.notificationIds) {
      await cancelNotification(id);
    }
  }

  routine.notificationIds = [];

  const type = routine.type;
  const now = new Date();
  const config = routine.scheduleConfig;

  switch (type) {
    case "laundry":
      if (routine.nextReminderAt) {
        const content = getNotificationContent(type, routine.name);
        const id = await scheduleNotification(
          content.title,
          content.body,
          routine.nextReminderAt,
          routine.id,
          routine.type,
          "🧺",
        );
        routine.notificationIds.push(id);
      }
      break;

    case "plant":
      if (config.intervalDays) {
        const next = new Date(now);
        next.setDate(next.getDate() + config.intervalDays);
        const content = getNotificationContent(type, routine.name);
        const id = await scheduleNotification(
          content.title,
          content.body,
          next,
          routine.id,
          routine.type,
          "🌱",
        );
        routine.notificationIds.push(id);
      }
      break;

    case "pet":
      if (config.feedingTimes?.length) {
        for (const time of config.feedingTimes) {
          const [hour, minute] = time.split(":").map(Number);
          const date = new Date(now);
          date.setHours(hour, minute, 0, 0);
          if (date < now) date.setDate(date.getDate() + 1);
          const content = getNotificationContent(type, routine.name);
          const id = await scheduleNotification(
            content.title,
            content.body,
            date,
            routine.id,
            routine.type,
            "🐾",
          );
          routine.notificationIds.push(id);
        }
      }
      break;

    case "trash":
      if (config.pickupDays?.length) {
        for (const day of config.pickupDays) {
          const date = getNextDayTime(day, 6, 0); // 6AM reminder
          const content = getNotificationContent(type, routine.name);
          const id = await scheduleNotification(
            content.title,
            content.body,
            date,
            routine.id,
            routine.type,
            "🗑️",
          );
          routine.notificationIds.push(id);
        }
      }
      break;
  }
};

export const rescheduleAllRoutines = async () => {
  const enabled = await areNotificationsEnabled();
  if (!enabled) return;

  const routines = await getRoutines();
  for (const r of routines) {
    await scheduleRoutineNotifications(r);
  }
};
