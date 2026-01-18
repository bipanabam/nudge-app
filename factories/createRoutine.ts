import { Routine, RoutineType, ScheduleConfig } from '@/types/routine';
import * as Crypto from 'expo-crypto';

const generateId = () => Crypto.randomUUID();

const computeNextReminder = (
  type: RoutineType,
  config: ScheduleConfig,
  now: Date
): Date | null => {
  switch (type) {
    case 'laundry':
      return config.durationMinutes
        ? new Date(now.getTime() + config.durationMinutes * 60_000)
        : null;

    case 'plant':
      return config.intervalDays
        ? new Date(now.getTime() + config.intervalDays * 24 * 60 * 60_000)
        : null;

    case 'pet':
      return now; // next feeding is "now"

    case 'trash':
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
  };
};
