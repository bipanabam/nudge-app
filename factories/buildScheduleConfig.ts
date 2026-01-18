import { RoutineType, ScheduleConfig } from '@/types/routine';

export type ScheduleInput = {
  laundry?: { durationMinutes: number };
  plant?: { intervalDays: number };
  pet?: { feedingTimes: string[] };
  trash?: { pickupDays: number[]; isRecycling: boolean };
};

export const buildScheduleConfig = (
  type: RoutineType,
  input: ScheduleInput
): ScheduleConfig => {
  switch (type) {
    case 'laundry':
      return { durationMinutes: input.laundry!.durationMinutes };

    case 'plant':
      return { intervalDays: input.plant!.intervalDays };

    case 'pet':
      return {
        feedingTimes: input.pet!.feedingTimes,
        lastFedSession: null,
      };

    case 'trash':
      return {
        pickupDays: input.trash!.pickupDays,
        isRecycling: input.trash!.isRecycling,
      };
  }
};
