import { defaultRoutines } from "@/data/defaultRoutines";
import {
    Routine,
    RoutineStatus,
    getRoutineProgress,
    getRoutineStatus,
} from "@/types/routine";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

export interface RoutineWithProgress extends Routine {
  status: RoutineStatus;
  progressCount: number;
  targetCount: number;
}

export const useRoutines = () => {
  const [routines, setRoutines] = useState<RoutineWithProgress[]>([]);

  const refreshRoutines = async () => {
    const stored = await AsyncStorage.getItem("routines");
    const loaded: Routine[] = stored ? JSON.parse(stored) : defaultRoutines;

    const updated: RoutineWithProgress[] = await Promise.all(
      loaded.map(async (r) => {
        const status = await getRoutineStatus(r);
        const { progressCount, targetCount } = await getRoutineProgress(r);
        return { ...r, status, progressCount, targetCount };
      }),
    );

    setRoutines(updated);
  };

  useEffect(() => {
    refreshRoutines();
  }, []);

  return { routines, setRoutines, refreshRoutines };
};
