import { Routine } from "@/types/routine";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "routines";

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
    JSON.stringify([...routines, routine]),
  );
};

export async function updateRoutine(updatedRoutine: Routine) {
  const stored = await AsyncStorage.getItem(STORAGE_KEY);
  if (!stored) return;

  const routines = JSON.parse(stored) as Routine[];

  const updated = routines.map((r) =>
    r.id === updatedRoutine.id ? updatedRoutine : r,
  );

  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export const getRoutineById = async (id: string): Promise<Routine | null> => {
  const routines = await getRoutines();
  return routines.find((r) => r.id === id) ?? null;
};

export const saveRoutine = async (routine: Routine) => {
  const routines = await getRoutines();

  const exists = routines.some((r) => r.id === routine.id);

  const updated = exists
    ? routines.map((r) => (r.id === routine.id ? routine : r))
    : [...routines, routine];

  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};
