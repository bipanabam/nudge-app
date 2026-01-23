import { Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  View,
  useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  daysAgo,
  formatDate,
  formatStringToDate,
  formatTime12h,
} from "@/hooks/helpers";
import { getHistory } from "@/storage/historyStorage";
import { getRoutineById } from "@/storage/routineStorage";
import { RoutineHistory } from "@/types/history";
import { Routine, getRoutineIcon, routineStyles } from "@/types/routine";

const StatCard = ({ label, value }: { label: string; value: string }) => (
  <View className="w-[48%] rounded-xl p-4 bg-muted dark:bg-muted-dark">
    <Text className="text-sm text-mutedForeground dark:text-mutedForeground-dark">
      {label}
    </Text>
    <Text className="text-lg font-bold text-foreground dark:text-foreground-dark mt-1">
      {value}
    </Text>
  </View>
);

const formatSchedule = (routine: Routine) => {
  const { type, scheduleConfig } = routine;

  switch (type) {
    case "laundry":
      return scheduleConfig.durationMinutes
        ? `Takes about ${scheduleConfig.durationMinutes} minutes`
        : "No duration set";

    case "plant":
      return scheduleConfig.intervalDays
        ? `Every ${scheduleConfig.intervalDays} days`
        : "No interval set";

    case "pet":
      if (!scheduleConfig.feedingTimes?.length) {
        return "No feeding times set";
      }
      const feedingTimes = scheduleConfig.feedingTimes.map((time) =>
        formatTime12h(time),
      );
      return `Feeds at ${feedingTimes.join(", ")}`;

    case "trash":
      if (!scheduleConfig.pickupDays?.length) {
        return "No pickup days set";
      }
      const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const pickupDays = scheduleConfig.pickupDays
        .map((d) => days[d])
        .join(", ");
      return `Pickup on ${pickupDays}${
        scheduleConfig.isRecycling ? " (Recycling)" : ""
      }`;

    default:
      return "";
  }
};

export default function RoutineDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [routine, setRoutine] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [style, setStyle] = useState<any>(null);
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  useEffect(() => {
    const load = async () => {
      const r = await getRoutineById(id);
      const h = await getHistory();
      setRoutine(r);
      const type = r ? r.type : "laundry";
      setStyle(routineStyles[type]);
      setHistory(h.filter((x) => x.routineId === id));
    };
    load();
  }, [id]);

  if (!routine) return null;

  const totalDone = history.length;
  const completionRate = routine.createdAt
    ? Math.round(
        (totalDone / Math.max(daysAgo(new Date(routine.createdAt)), 1)) * 100,
      )
    : 0;

  const groupByDate = (items: RoutineHistory[]) => {
    return items.reduce(
      (acc, item) => {
        const key = item.completedAt.toDateString();
        acc[key] ??= [];
        acc[key].push(item);
        return acc;
      },
      {} as Record<string, RoutineHistory[]>,
    );
  };
  const grouped = groupByDate(history);

  return (
    <SafeAreaView
      className="flex-1 bg-background dark:bg-background-dark"
      edges={["top"]}
    >
      <View className="flex-1 p-4">
        <ScrollView
          className="flex-1 px-5"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 80 }}
        >
          {/* Back */}
          <Pressable
            onPress={() => router.back()}
            className="flex-row items-center gap-2 mb-4"
          >
            <Feather
              name="arrow-left"
              color={isDarkMode ? "white" : "black"}
              size={20}
            />
            <Text className="text-sm text-foreground dark:text-foreground-dark">
              Back
            </Text>
          </Pressable>

          {/* Top Card */}
          <View
            className={`${style?.bg} ${style?.dark} rounded-2xl p-5 bg-card dark:bg-card-dark mb-5`}
          >
            <Text className="text-4xl mb-2">
              {getRoutineIcon(routine.type)}
            </Text>

            <Text className={`font-bold text-lg ${style?.fg} ${style?.fgDark}`}>
              {routine.name}
            </Text>

            <Text className="text-sm text-mutedForeground dark:text-mutedForeground-dark mt-1">
              Created {daysAgo(new Date(routine.createdAt))} days ago
            </Text>

            {/* Schedule */}
            <View className="mt-4 rounded-xl p-4 bg-muted dark:bg-muted-dark">
              <Text className="text-xs uppercase tracking-wide text-mutedForeground dark:text-mutedForeground-dark mb-1">
                Schedule
              </Text>

              <Text className="text-base font-semibold text-foreground dark:text-foreground-dark">
                {formatSchedule(routine)}
              </Text>
            </View>
          </View>

          {/* Stats */}
          <Text className="font-bold text-xl mb-3 text-foreground dark:text-foreground-dark">
            Statistics
          </Text>

          <View className="flex-row flex-wrap gap-3">
            <StatCard label="Total Done" value={`${totalDone} times`} />
            <StatCard label="Completion Rate" value={`${completionRate}%`} />
            <StatCard
              label="Last Completed"
              value={formatDate(routine.lastCompletedAt)}
            />
            <StatCard
              label="Next Due"
              value={formatDate(routine.nextReminderAt)}
            />
          </View>

          {/* History */}
          <Text className="font-bold text-xl mb-3 mt-6 text-foreground dark:text-foreground-dark">
            History
          </Text>

          {Object.entries(grouped).map(([date, items]) => (
            <View key={date} className="mb-6">
              {/* Date header */}
              <Text className="text-mutedForeground font-semibold mb-3">
                {formatStringToDate(date)}
              </Text>
              {/* Cards */}
              {items.map((item) => (
                <View
                  key={item.id}
                  className="rounded-xl p-4 bg-card dark:bg-card-dark mb-3"
                >
                  <Text className="font-semibold text-foreground dark:text-foreground-dark">
                    Completed
                  </Text>
                  <Text className="text-sm text-mutedForeground dark:text-mutedForeground-dark">
                    {formatDate(new Date(item.completedAt))}
                  </Text>
                </View>
              ))}
            </View>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
