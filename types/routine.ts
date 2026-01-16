export type RoutineType = 'laundry' | 'plant' | 'pet' | 'trash';

export type RoutineStatus = 'idle' | 'active' | 'done' | 'overdue';

export interface Routine {
  id: string;
  type: RoutineType;
  name: string;
  lastCompletedAt: Date | null;
  nextReminderAt: Date | null;
  scheduleConfig: ScheduleConfig;
  isActive: boolean;
  createdAt: Date;
}

export interface ScheduleConfig {
  // Laundry
  durationMinutes?: number;

  // Plant
  intervalDays?: number;

  // Pet
  feedingTimes?: string[];
  lastFedSession?: string | null;

  // Trash
  pickupDays?: number[]; // 0–6 (Sun–Sat)
  isRecycling?: boolean;
}

// helpers
export const getRoutineIcon = (type: RoutineType) => {
  switch (type) {
    case 'laundry': return '🧺';
    case 'plant': return '🌱';
    case 'pet': return '🐶';
    case 'trash': return '🗑️';
  }
};

export const getActionLabel = (type: RoutineType) => {
  switch (type) {
    case 'laundry': return 'Laundry Done';
    case 'plant': return 'Watered';
    case 'pet': return 'Fed';
    case 'trash': return 'Taken out';
  }
};

// status calculator
export const getRoutineStatus = (routine: Routine): RoutineStatus => {
  const now = new Date();

  if (routine.type === 'laundry') {
    if (routine.nextReminderAt && routine.nextReminderAt > now) {
      return 'active';
    }
    return 'idle';
  }

  if (routine.nextReminderAt && routine.nextReminderAt <= now) {
    return 'overdue';
  }

  if (routine.lastCompletedAt) {
    return 'done';
  }

  return 'idle';
};
