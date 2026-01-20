export type RoutineType = "laundry" | "plant" | "pet" | "trash";

export type RoutineStatus = "idle" | "active" | "done" | "overdue";

export interface Routine {
  id: string;
  type: RoutineType;
  name: string;
  lastCompletedAt: Date | null;
  nextReminderAt: Date | null;
  scheduleConfig: ScheduleConfig;
  isActive: boolean;
  createdAt: Date;
  notificationIds?: string[];
}

export interface ScheduleConfig {
  // Laundry
  durationMinutes?: number;

  // Plant
  intervalDays?: number;

  // Pet
  feedingTimes?: string[];
  lastFedSession?: string | null;

  // Trash
  pickupDays?: number[]; // 0–6 (Sun–Sat)
  isRecycling?: boolean;
}

// helpers
export const getRoutineIcon = (type: RoutineType) => {
  switch (type) {
    case "laundry":
      return "🧺";
    case "plant":
      return "🌱";
    case "pet":
      return "🐶";
    case "trash":
      return "🗑️";
  }
};

export const getActionLabel = (type: RoutineType) => {
  switch (type) {
    case "laundry":
      return "Laundry Done";
    case "plant":
      return "Watered";
    case "pet":
      return "Fed";
    case "trash":
      return "Taken out";
  }
};

// status calculator
export const getRoutineStatus = (routine: Routine): RoutineStatus => {
  const now = new Date();

  switch (routine.type) {
    case "laundry":
      if (!routine.nextReminderAt) return "idle";
      if (
        routine.lastCompletedAt &&
        routine.lastCompletedAt >= routine.nextReminderAt
      )
        return "done";
      if (routine.nextReminderAt > now) return "active";
      return "idle";

    case "plant":
    case "pet":
    case "trash":
      if (routine.nextReminderAt && routine.nextReminderAt <= now)
        return "overdue";
      if (
        routine.lastCompletedAt &&
        routine.lastCompletedAt >= routine.nextReminderAt!
      )
        return "done";
      return "idle";
  }
};

// action button
import { Feather } from "@expo/vector-icons";

type ActionConfig = {
  label: string;
  icon: keyof typeof Feather.glyphMap;
  action: "start" | "complete" | "noop";
};

export const getRoutineActionConfig = (
  routine: Routine,
  status: RoutineStatus,
): ActionConfig => {
  switch (routine.type) {
    case "laundry":
      if (status === "idle") {
        return {
          label: `Start Laundry (${routine.scheduleConfig.durationMinutes} min)`,
          icon: "clock",
          action: "start",
        };
      }
      if (status === "active") {
        return {
          label: "Laundry Done",
          icon: "check",
          action: "complete",
        };
      }
      return {
        label: "Laundry Done",
        icon: "check",
        action: "complete",
      };

    case "plant":
      if (status === "done") {
        return {
          label: "Watered",
          icon: "check",
          action: "noop",
        };
      }
      return {
        label: status === "overdue" ? "Water Now!" : "Water Plant",
        icon: "clock",
        action: "complete",
      };

    case "pet":
      if (status === "done") {
        return {
          label: "Fed",
          icon: "check",
          action: "noop",
        };
      }
      return {
        label: status === "overdue" ? "Feed Now!" : "Feed Pet",
        icon: "clock",
        action: "complete",
      };

    case "trash":
      if (status === "done") {
        return {
          label: "Taken Out",
          icon: "check",
          action: "noop",
        };
      }
      return {
        label: status === "overdue" ? "Take Out Now!" : "Take Out Trash",
        icon: "clock",
        action: "complete",
      };
  }
};

import Toast from "react-native-toast-message";

export const showRoutineToast = (
  routine: Routine,
  action: "start" | "complete",
) => {
  let message = "";

  if (action === "start" && routine.type === "laundry") {
    message = `🧺 Laundry started`;
  } else if (action === "complete") {
    switch (routine.type) {
      case "plant":
        message = `🌱 Watered ${routine.name}`;
        break;
      case "trash":
        message = `🗑 Trash taken out`;
        break;
      case "pet":
        message = `🐾 ${routine.name} fed`;
        break;
      case "laundry":
        message = `🧺 Laundry completed`;
        break;
    }
  }

  if (message) {
    Toast.show({
      type: "success",
      text1: message,
      position: "top",
      topOffset: 50,
      visibilityTime: 2000,
    });
  }
};
