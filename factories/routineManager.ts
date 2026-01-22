import { isToday } from "@/hooks/helpers";
import {
  addHistoryEntry,
  emitHistoryUpdate,
  getHistory,
} from "@/storage/historyStorage";
import { getRoutines, saveRoutine } from "@/storage/routineStorage";
import { RoutineHistory } from "@/types/history";
import { Routine, RoutineType, ScheduleConfig } from "@/types/routine";
import { scheduleRoutineNotifications } from "@/utils/routineNotifications";
import * as Crypto from "expo-crypto";

const generateId = () => Crypto.randomUUID();

export const getNextPetFeedingTime = (
  feedingTimes: string[],
  now: Date = new Date(),
): Date | null => {
  if (!feedingTimes.length) return null;

  // Sort times just in case
  const sorted = [...feedingTimes].sort();

  for (const time of sorted) {
    const [hour, minute] = time.split(":").map(Number);

    const candidate = new Date(now);
    candidate.setHours(hour, minute, 0, 0);

    if (candidate > now) {
      return candidate;
    }
  }

  // No time left today → return tomorrow's first feeding
  const [hour, minute] = sorted[0].split(":").map(Number);
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(hour, minute, 0, 0);

  return tomorrow;
};

export const getNextTrashPickupDate = (
  pickupDays: number[],
  now: Date = new Date(),
): Date | null => {
  if (!pickupDays.length) return null;

  const today = now.getDay();

  // Try next 7 days
  for (let i = 0; i < 7; i++) {
    const dayToCheck = (today + i) % 7;

    if (pickupDays.includes(dayToCheck)) {
      const candidate = new Date(now);
      candidate.setDate(now.getDate() + i);
      candidate.setHours(9, 0, 0, 0); // 9am pickup (adjustable)

      // If today, ensure it's still upcoming
      if (candidate > now) {
        return candidate;
      }
    }
  }

  return null;
};

const computeNextReminder = (
  type: RoutineType,
  config: ScheduleConfig,
  now: Date,
): Date | null => {
  switch (type) {
    case "laundry":
      return null;

    case "plant":
      return config.intervalDays
        ? new Date(now.getTime() + config.intervalDays * 24 * 60 * 60_000)
        : null;

    case "pet":
      return getNextPetFeedingTime(config.feedingTimes ?? [], now);

    case "trash":
      return getNextTrashPickupDate(config.pickupDays ?? [], now);
  }
};

export const createRoutine = (params: {
  type: RoutineType;
  name: string;
  schedule: ScheduleConfig;
}): Routine => {
  const now = new Date();

  return {
    id: generateId(),
    type: params.type,
    name: params.name,
    scheduleConfig: params.schedule,
    lastCompletedAt: null,
    nextReminderAt: computeNextReminder(params.type, params.schedule, now),
    isActive: true,
    createdAt: now,
    notificationIds: [],
  };
};

export const initRoutine = async (params: {
  type: RoutineType;
  name: string;
  schedule: ScheduleConfig;
}): Promise<Routine> => {
  const routine = createRoutine(params);
  await scheduleRoutineNotifications(routine);
  return routine;
};

export const completeRoutine = async (routine: Routine) => {
  const now = new Date();
  routine.lastCompletedAt = now;

  // Compute next reminder (for laundry or plant)
  routine.nextReminderAt = computeNextReminder(
    routine.type,
    routine.scheduleConfig,
    now,
  );

  await addHistoryEntry({
    id: Crypto.randomUUID(),
    routineId: routine.id,
    name: routine.name,
    type: routine.type,
    completedAt: now,
  });
  emitHistoryUpdate(); // <-- notify listeners

  await scheduleRoutineNotifications(routine);
  await saveRoutine(routine);
};

export const updateRoutineWithNotifications = async (
  routine: Routine,
  updates: {
    name: string;
    type: RoutineType;
    scheduleConfig: ScheduleConfig;
  },
): Promise<Routine> => {
  const updated: Routine = {
    ...routine,
    ...updates,
    lastCompletedAt: null, // reset completion on edit
    nextReminderAt: computeNextReminder(
      updates.type,
      updates.scheduleConfig,
      new Date(),
    ),
  };

  await scheduleRoutineNotifications(updated);
  return updated;
};

export const computeDailyStats = (
  routines: Routine[],
  history: RoutineHistory[],
) => {
  const completedTodayRoutineIds = new Set(
    history
      .filter((h) => isToday(new Date(h.completedAt)))
      .map((h) => h.routineId),
  );

  const total = routines.length;
  const done = completedTodayRoutineIds.size;
  const needsAttention = total - done;

  return {
    total,
    done,
    needsAttention,
  };
};

export const getDailyStats = async () => {
  const routines = await getRoutines();
  const history = await getHistory();

  return computeDailyStats(routines, history);
};
