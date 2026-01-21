import { completeRoutine } from "@/factories/routineManager";
import { getRoutineById, saveRoutine } from "@/storage/routineStorage";
import * as Notifications from "expo-notifications";
import Toast from "react-native-toast-message";
import { snoozeRoutine } from "./snoozeRoutine";

type RoutineNotificationData = {
  routineId: string;
};

export const registerNotificationListeners = () => {
  // Handle background/killed state actions
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
  // Handle foreground arrival (BETTER UI)
  Notifications.addNotificationReceivedListener((notification) => {
    const { title, body, data } = notification.request.content;
    const routineId = data?.routineId;
    if (typeof routineId !== "string") return;

    Toast.show({
      type: "nudge", // Matches the key in ToastHost config
      text1: title ?? "Gentle Nudge",
      text2: body ?? "Time for your routine",
      props: {
        // Pass the routine icon (e.g., 🌱, 🐾) through props
        icon: data?.icon,
        onComplete: async () => {
          if (!routineId) return;
          const routine = await getRoutineById(routineId);
          if (routine) {
            await completeRoutine(routine);
            await saveRoutine(routine);
            console.log("Routine completed via Toast!");
          }
        },
      },
    });
  });
};
