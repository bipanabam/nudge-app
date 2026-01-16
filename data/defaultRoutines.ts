import { Routine } from '@/types/routine';

export const defaultRoutines: Routine[] = [
  {
    id: 'pet-1',
    type: 'pet',
    name: 'Buddy',
    lastCompletedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    nextReminderAt: new Date(),
    scheduleConfig: {
      feedingTimes: ['08:00', '18:00'],
    },
    isActive: true,
    createdAt: new Date(),
  },
  {
    id: 'plant-1',
    type: 'plant',
    name: 'Houseplants',
    lastCompletedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    nextReminderAt: new Date(),
    scheduleConfig: {
      intervalDays: 5,
    },
    isActive: true,
    createdAt: new Date(),
  },
  {
    id: 'trash-1',
    type: 'trash',
    name: 'Trash & Recycling',
    lastCompletedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
    nextReminderAt: new Date(),
    scheduleConfig: {
      pickupDays: [1, 4],
      isRecycling: true,
    },
    isActive: true,
    createdAt: new Date(),
  },
  {
    id: 'laundry-1',
    type: 'laundry',
    name: 'Laundry',
    lastCompletedAt: null,
    nextReminderAt: null,
    scheduleConfig: {
      durationMinutes: 45,
    },
    isActive: true,
    createdAt: new Date(),
  },
];
