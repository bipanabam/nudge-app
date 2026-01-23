export type RoutineType = "laundry" | "plant" | "pet" | "trash";

export type RoutineStatus = "idle" | "active" | "done" | "overdue" | "partial";

export interface Routine {
  id: string;
  type: RoutineType;
  name: string;
  lastCompletedAt: Date | null;
  nextReminderAt: Date | null;
  scheduleConfig: ScheduleConfig;
  isActive: boolean;
  inProgress?: boolean;
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

// status helper
type StatusConfig = {
  bg: string;
  text: string;
  icon: any;
};

export const STATUS_CONFIG: Record<RoutineStatus, StatusConfig> = {
  idle: {
    bg: "bg-muted",
    text: "text-mutedForeground",
    icon: "clock",
  },
  active: {
    bg: "bg-status-active",
    text: "text-blue-600",
    icon: "clock",
  },
  overdue: {
    bg: "bg-status-overdue",
    text: "text-red-600",
    icon: "alert-circle",
  },
  partial: {
    bg: "bg-orange-50",
    text: "text-orange-600",
    icon: "progress-check",
  },
  done: {
    bg: "bg-status-done",
    text: "text-green-600",
    icon: "check",
  },
};

import { isToday } from "@/hooks/helpers";
import { getHistory } from "@/storage/historyStorage";

// status calculator
export const getRoutineStatus = async (
  routine: Routine,
): Promise<RoutineStatus> => {
  const now = new Date();

  switch (routine.type) {
    case "laundry": {
      const { inProgress, nextReminderAt, lastCompletedAt } = routine;

      if (inProgress) return "active";

      if (!nextReminderAt && !lastCompletedAt) return "idle";

      if (
        nextReminderAt &&
        lastCompletedAt &&
        lastCompletedAt >= nextReminderAt
      ) {
        return "done";
      }

      if (nextReminderAt && nextReminderAt <= now) {
        return "overdue";
      }

      return "idle";
    }

    case "plant": {
      // get today's history for this routine
      const history = await getHistory();
      const todayHistory = history.filter(
        (h) => h.routineId === routine.id && isToday(h.completedAt),
      );

      const targetCount = routine.scheduleConfig.intervalDays || 1;
      if (todayHistory.length === 0) return "idle";
      if (todayHistory.length < targetCount) return "partial";
      return "done";
    }

    case "pet": {
      const history = await getHistory();
      const todayHistory = history.filter(
        (h) => h.routineId === routine.id && isToday(h.completedAt),
      );

      const targetCount = routine.scheduleConfig.feedingTimes?.length || 1;
      if (todayHistory.length === 0) return "idle";
      if (todayHistory.length < targetCount) return "partial";
      return "done";
    }
    case "trash":
      if (!routine.nextReminderAt) return "idle";
      if (
        routine.lastCompletedAt &&
        routine.lastCompletedAt >= routine.nextReminderAt
      )
        return "done";
      if (routine.nextReminderAt <= now) return "overdue";
      return "idle";
  }
};

export const getRoutineProgress = async (routine: Routine) => {
  const history = await getHistory();
  const todayHistory = history.filter(
    (h) => h.routineId === routine.id && isToday(new Date(h.completedAt)),
  );

  switch (routine.type) {
    case "plant":
      return {
        progressCount: todayHistory.length,
        targetCount: routine.scheduleConfig.intervalDays || 1,
      };
    case "pet":
      return {
        progressCount: todayHistory.length,
        targetCount: routine.scheduleConfig.feedingTimes?.length || 1,
      };
    default:
      return { progressCount: 0, targetCount: 1 };
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
  progressCount?: number,
  targetCount?: number,
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
          label: "Laundry InProgress",
          icon: "check",
          action: "complete",
        };
      }
      return { label: "Laundry Done", icon: "check", action: "complete" };

    case "plant":
      if (status === "done") {
        return {
          label: "Watered",
          icon: "check",
          action: "noop",
        };
      }
      if (status === "partial" && progressCount !== undefined && targetCount) {
        return {
          label: `Water Again (${progressCount}/${targetCount})`,
          icon: "clock",
          action: "complete",
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
      if (status === "partial" && progressCount !== undefined && targetCount) {
        return {
          label: `Feed Again (${progressCount}/${targetCount})`,
          icon: "clock",
          action: "complete",
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

// Routine Toast
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

export const routineStyles = {
  laundry: {
    bg: "bg-laundry-bg",
    dark: "dark:bg-laundry-bg-dark",
    fg: "text-laundry-fg",
    fgDark: "dark:text-laundry-fg-dark",
    button: "bg-laundry",
    buttonDark: "dark:bg-laundry-dark",
  },
  plant: {
    bg: "bg-plant-bg",
    dark: "dark:bg-plant-bg-dark",
    fg: "text-plant-fg",
    fgDark: "dark:text-plant-fg-dark",
    button: "bg-plant",
    buttonDark: "dark:bg-plant-dark",
  },
  pet: {
    bg: "bg-pet-bg",
    dark: "dark:bg-pet-bg-dark",
    fg: "text-pet-fg",
    fgDark: "dark:text-pet-fg-dark",
    button: "bg-pet",
    buttonDark: "dark:bg-pet-dark",
  },
  trash: {
    bg: "bg-trash-bg",
    dark: "dark:bg-trash-bg-dark",
    fg: "text-trash-fg",
    fgDark: "dark:text-trash-fg-dark",
    button: "bg-trash",
    buttonDark: "dark:bg-trash-dark",
  },
};
