import { completeRoutine } from "@/factories/routineManager";
import { getRoutineById, saveRoutine } from "@/storage/routineStorage";
import * as Notifications from "expo-notifications";
import { snoozeRoutine } from "./snoozeRoutine";

type RoutineNotificationData = {
  routineId: string;
};

export const registerNotificationListeners = () => {
  Notifications.addNotificationResponseReceivedListener(async (response) => {
    const action = response.actionIdentifier;
    const data = response.notification.request.content
      .data as Partial<RoutineNotificationData>;

    const routineId = data?.routineId;

    if (typeof routineId !== "string") return;

    const routine = await getRoutineById(routineId);
    if (!routine) return;

    switch (action) {
      case "DONE":
        await completeRoutine(routine);
        await saveRoutine(routine);
        break;

      case "SNOOZE_10":
        await snoozeRoutine(routine, 10);
        await saveRoutine(routine);
        break;

      default:
        // notification body tap
        break;
    }
  });
};
