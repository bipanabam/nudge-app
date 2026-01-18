import { Routine } from '@/types/routine';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'routines';

const reviveRoutine = (r: any): Routine => ({
  ...r,
  lastCompletedAt: r.lastCompletedAt ? new Date(r.lastCompletedAt) : null,
  nextReminderAt: r.nextReminderAt ? new Date(r.nextReminderAt) : null,
  createdAt: new Date(r.createdAt),
});

export const getRoutines = async (): Promise<Routine[]> => {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  return JSON.parse(raw).map(reviveRoutine);
};

export const addRoutine = async (routine: Routine) => {
  const routines = await getRoutines();
  await AsyncStorage.setItem(
    STORAGE_KEY,
    JSON.stringify([...routines, routine])
  );
};