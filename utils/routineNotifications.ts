import { getRoutines } from "@/storage/routineStorage";
import { Routine } from "@/types/routine";
import {
  cancelNotification,
  requestPermissions,
  scheduleNotification,
} from "./notifications";

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

export const scheduleRoutineNotifications = async (routine: Routine) => {
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
        const id = await scheduleNotification(
          `Laundry Time!`,
          `Start your laundry: ${routine.name}`,
          routine.nextReminderAt,
          routine.id,
        );
        routine.notificationIds.push(id);
      }
      break;

    case "plant":
      if (config.intervalDays) {
        const next = new Date(now);
        next.setDate(next.getDate() + config.intervalDays);
        const id = await scheduleNotification(
          `Water your plant 🌱`,
          `Time to water: ${routine.name}`,
          next,
          routine.id,
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
          const id = await scheduleNotification(
            `Feed your pet 🐾`,
            `Time to feed: ${routine.name}`,
            date,
            routine.id,
          );
          routine.notificationIds.push(id);
        }
      }
      break;

    case "trash":
      if (config.pickupDays?.length) {
        for (const day of config.pickupDays) {
          const date = getNextDayTime(day, 6, 0); // 6AM reminder
          const id = await scheduleNotification(
            `Take out trash 🗑️`,
            `${config.isRecycling ? "Recycling" : "Trash"} day for ${routine.name}`,
            date,
            routine.id,
          );
          routine.notificationIds.push(id);
        }
      }
      break;
  }
};

export const rescheduleAllRoutines = async () => {
  const routines = await getRoutines();
  for (const r of routines) {
    await scheduleRoutineNotifications(r);
  }
};
