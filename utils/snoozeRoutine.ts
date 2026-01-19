import { Routine } from "@/types/routine";
import { scheduleRoutineNotifications } from "./routineNotifications";

export const snoozeRoutine = async (routine: Routine, minutes: number) => {
  const snoozeUntil = new Date(Date.now() + minutes * 60_000);

  routine.nextReminderAt = snoozeUntil;

  await scheduleRoutineNotifications(routine);
};
