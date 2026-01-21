import {
  Routine,
  RoutineStatus,
  getRoutineActionConfig,
  getRoutineIcon,
} from "@/types/routine";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
interface RoutineCardProps {
  routine: Routine;
  status: RoutineStatus;
  progressCount: number;
  targetCount: number;
  onMorePress: () => void;
  onComplete: (id: string) => void;
  onStartLaundry?: (id: string) => void;
}

const StatusIcon = ({ status }: any) => {
  if (status === "idle") {
    return (
      <View
        className={`px-2 py-2 rounded-lg flex-row items-center gap-1 bg-muted text-mutedForeground`}
      >
        <Feather name="clock" size={18} color={""} />
        <Text className="font-semibold text-sm capitalize">{status}</Text>
      </View>
    );
  }
  if (status === "overdue") {
    return (
      <View
        className={`px-2 py-2 rounded-lg flex-row items-center gap-1 bg-status-overdue text-red-600`}
      >
        <Feather name="alert-circle" size={18} color="red" />
        <Text className="font-semibold text-sm capitalize">{status}</Text>
      </View>
    );
  }
  if (status === "active") {
    return (
      <View
        className={`px-2 py-2 rounded-lg flex-row items-center gap-1 bg-status-active text-blue-600`}
      >
        <Feather name="alert-circle" size={18} color="blue" />
        <Text className="font-semibold text-sm capitalize">{status}</Text>
      </View>
    );
  }
  if (status === "partial") {
    return (
      <View
        className={`px-2 py-2 rounded-lg flex-row items-center gap-1 bg-orange-50 text-orange-600`}
      >
        <MaterialCommunityIcons
          name="progress-check"
          size={18}
          color="orange"
        />
        <Text className="font-semibold text-sm capitalize">{status}</Text>
      </View>
    );
  }
  return (
    <View
      className={`px-2 py-2 rounded-lg flex-row items-center gap-1 bg-status-done text-green-600`}
    >
      <Feather name="check" size={18} color={"#2F3A36"} />
      <Text className="font-semibold text-sm capitalize">{status}</Text>
    </View>
  );
};

// Map routine types to their full class names
const routineStyles = {
  laundry: {
    bg: "bg-laundry-bg",
    fg: "text-laundry-fg",
    button: "bg-laundry",
  },
  plant: { bg: "bg-plant-bg", fg: "text-plant-fg", button: "bg-plant" },
  pet: { bg: "bg-pet-bg", fg: "text-pet-fg", button: "bg-pet" },
  trash: { bg: "bg-trash-bg", fg: "text-trash-fg", button: "bg-trash" },
};

export const RoutineCard = ({
  routine,
  status,
  progressCount,
  targetCount,
  onMorePress,
  onComplete,
  onStartLaundry,
}: RoutineCardProps) => {
  const [pressed, setPressed] = useState(false);

  const styles = routineStyles[routine.type];
  const action = getRoutineActionConfig(
    routine,
    status,
    progressCount,
    targetCount,
  );
  const isDisabled = action.action === "noop";

  const progressPercent = targetCount ? (progressCount / targetCount) * 100 : 0;

  const handleActionPress = () => {
    if (routine.type === "laundry" && action.action === "start") {
      onStartLaundry?.(routine.id);
    } else if (action.action === "complete") {
      onComplete(routine.id);
    }
  };

  // Color based on status
  const progressColor =
    status === "done"
      ? "bg-green-400"
      : status === "partial"
        ? "bg-orange-400"
        : "bg-gray-400";

  const cardOpacity = status === "done" ? 0.6 : 1;

  return (
    <Pressable
      className={`rounded-xl p-5 mb-4 ${styles.bg}`}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      style={{
        transform: [{ scale: pressed ? 0.97 : 1 }],
        opacity: cardOpacity,
      }}
    >
      {/* Header */}
      <View className="flex-row justify-between items-start mb-3">
        <View className="flex-row items-center gap-3">
          <Text className={`text-3xl ${styles.fg}`}>
            {getRoutineIcon(routine.type)}
          </Text>
          <View>
            <Text className={`font-bold text-lg ${styles.fg}`}>
              {routine.name}
            </Text>
            <Text className="text-sm text-mutedForeground">
              {routine.lastCompletedAt
                ? "Last done recently"
                : "Never completed"}
            </Text>
          </View>
        </View>
        <View className="flex-row gap-2 items-center">
          <StatusIcon status={status} />
          <Pressable
            onPress={onMorePress}
            className="rounded-lg items-center p-3 bg-card"
          >
            <Feather name="more-vertical" size={20} color="#2F3A36" />
          </Pressable>
        </View>
      </View>

      {/* Progress Section */}
      {targetCount > 1 && (
        <View className="mb-3">
          <View className="flex-row justify-between items-center mb-1">
            <Text className="text-sm text-mutedForeground">
              Progress: {progressCount}/{targetCount} done
            </Text>
            <Text className="text-sm text-mutedForeground">
              {Math.round(progressPercent)}%
            </Text>
          </View>
          <View className="w-full h-2 bg-gray-200 rounded-full">
            <View
              className={`h-2 rounded-full ${progressColor}`}
              style={{ width: `${progressPercent}%` }}
            />
          </View>
        </View>
      )}
      {/* Action */}
      <Pressable
        disabled={isDisabled}
        className={`${styles.button} flex flex-row justify-center rounded-xl py-4 items-center mt-2 gap-2`}
        onPress={handleActionPress}
      >
        <Feather name={action.icon} color={"white"} size={20} />
        <Text className="font-bold text-white">{action.label}</Text>
      </Pressable>
    </Pressable>
  );
};
