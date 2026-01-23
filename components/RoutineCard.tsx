import {
  Routine,
  RoutineStatus,
  getRoutineActionConfig,
  getRoutineIcon,
  routineStyles,
} from "@/types/routine";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, Text, View, useColorScheme } from "react-native";

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
        className={`px-2 py-2 rounded-lg flex-row items-center gap-1 bg-muted dark:bg-muted-dark`}
      >
        <Feather name="clock" size={16} color="#767676" />
        <Text className="font-semibold text-sm capitalize text-mutedForeground dark:text-mutedForeground-dark">
          {status}
        </Text>
      </View>
    );
  }
  if (status === "overdue") {
    return (
      <View
        className={`px-2 py-2 rounded-lg flex-row items-center gap-1 bg-status-overdue dark:bg-red-900/30`}
      >
        <Feather name="alert-circle" size={16} color="red" />
        <Text className="font-semibold text-sm capitalize text-red-600">
          {status}
        </Text>
      </View>
    );
  }
  if (status === "active") {
    return (
      <View
        className={`px-2 py-2 rounded-lg flex-row items-center gap-1 bg-status-active dark:bg-blue-900/30`}
      >
        <Feather name="alert-circle" size={16} color="blue" />
        <Text className="font-semibold text-sm capitalize text-blue-600">
          {status}
        </Text>
      </View>
    );
  }
  if (status === "partial") {
    return (
      <View
        className={`px-2 py-2 rounded-lg flex-row items-center gap-1 bg-orange-200 dark:bg-amber-900/30`}
      >
        <MaterialCommunityIcons
          name="progress-check"
          size={16}
          color="orange"
        />
        <Text className="font-semibold text-sm capitalize text-amber-600">
          {status}
        </Text>
      </View>
    );
  }
  return (
    <View
      className={`px-2 py-2 rounded-lg flex-row items-center gap-1 bg-status-done dark:bg-green-900/30`}
    >
      <Feather name="check" size={16} color="green" />
      <Text className="font-semibold text-sm capitalize text-green-700">
        {status}
      </Text>
    </View>
  );
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
  const router = useRouter();
  const [pressed, setPressed] = useState(false);
  const isDarkMode = useColorScheme() === "dark";

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
      className={`rounded-xl p-5 mb-4 ${styles.bg} ${styles.dark}`}
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
          <Text className={`text-3xl ${styles.fg} ${styles.fgDark}`}>
            {getRoutineIcon(routine.type)}
          </Text>
          <View>
            <View className="flex-row items-center gap-2">
              <Text
                className={`font-bold text-lg ${styles.fg} ${styles.fgDark}`}
              >
                {routine.name}
              </Text>

              <Pressable
                onPress={() => router.push(`/routines/${routine.id}`)}
                hitSlop={8}
              >
                <Feather
                  name="chevron-right"
                  size={16}
                  color={isDarkMode ? "white" : "black"}
                  className="text-mutedForeground dark:text-mutedForeground-dark"
                />
              </Pressable>
            </View>
            <Text className="text-sm text-mutedForeground dark:text-mutedForeground-dark">
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
            className="rounded-lg items-center p-3 bg-card dark:bg-card-dark"
          >
            <Feather
              name="more-vertical"
              size={20}
              color="currentColor"
              className="text-foreground dark:text-white"
            />
          </Pressable>
        </View>
      </View>

      {/* Progress Section */}
      {targetCount > 1 && (
        <View className="mb-3">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-sm text-mutedForeground dark:text-mutedForeground-dark">
              Progress: {progressCount}/{targetCount} done
            </Text>
            <Text className="text-sm text-mutedForeground dark:text-mutedForeground-dark">
              {Math.round(progressPercent)}%
            </Text>
          </View>
          <View className="w-full h-2 bg-gray-200 dark:bg-background-dark rounded-full">
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
        className={`${styles.button} ${styles.buttonDark} flex flex-row justify-center rounded-xl py-4 items-center mt-2 gap-2`}
        onPress={handleActionPress}
      >
        <Feather name={action.icon} color={"white"} size={20} />
        <Text className="font-bold text-white">{action.label}</Text>
      </Pressable>
    </Pressable>
  );
};
