import { RoutineHistory } from "@/types/history";
import AsyncStorage from "@react-native-async-storage/async-storage";

const HISTORY_KEY = "routine_history";

const revive = (h: any): RoutineHistory => ({
  ...h,
  completedAt: new Date(h.completedAt),
});

export const getHistory = async (): Promise<RoutineHistory[]> => {
  const raw = await AsyncStorage.getItem(HISTORY_KEY);
  if (!raw) return [];
  return JSON.parse(raw).map(revive);
};

export const addHistoryEntry = async (entry: RoutineHistory) => {
  const history = await getHistory();
  await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify([entry, ...history]));
};
