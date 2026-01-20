import { RoutineType } from "./routine";

export interface RoutineHistory {
  id: string;
  routineId: string;
  name: string;
  type: RoutineType;
  completedAt: Date;
}
