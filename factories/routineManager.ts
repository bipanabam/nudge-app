import { addHistoryEntry, emitHistoryUpdate } from "@/storage/historyStorage";
import { saveRoutine } from "@/storage/routineStorage";
import { Routine, RoutineType, ScheduleConfig } from "@/types/routine";
import { scheduleRoutineNotifications } from "@/utils/routineNotifications";
import * as Crypto from "expo-crypto";

const generateId = () => Crypto.randomUUID();

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
      return now; // next feeding is "now"

    case "trash":
      return now; // next pickup is calculated later
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
