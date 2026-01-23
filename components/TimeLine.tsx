import { Routine } from "@/types/routine";
import { Text, View } from "react-native";

const buildTimeline = (routine: Routine, history: any[], days = 7) => {
  const today = new Date();
  const slots: { date: Date; count: number }[] = [];

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);

    const count = history.filter(
      (h) => new Date(h.completedAt).toDateString() === date.toDateString(),
    ).length;

    slots.push({ date, count });
  }

  return { slots };
};

const Timeline = ({ routine, history }: any) => {
  const { slots } = buildTimeline(routine, history);
  const daysActive = slots.filter((s) => s.count > 0).length;
  const totalCompletions = slots.reduce((sum, s) => sum + s.count, 0);

  return (
    <View className="flex-col justify-between rounded-xl p-4 bg-muted dark:bg-muted-dark">
      <View className="flex-1 flex-row gap-1">
        {slots.map((s, i) => (
          <View key={i} className="items-center">
            <View
              className={`h-10 w-10 items-center justify-center ${
                s.count > 0
                  ? "bg-primary dark:bg-primary-dark"
                  : "bg-background dark:bg-background-dark"
              }`}
              style={{ borderRadius: 10 }}
            >
              {s.count >= 1 && (
                <Text className="text-xs text-white font-bold">{s.count}</Text>
              )}
            </View>

            <View className="mt-2">
              <Text className="text-sm text-mutedForeground dark:text-mutedForeground-dark">
                {s.date.toLocaleDateString(undefined, { weekday: "short" })}
              </Text>
            </View>
          </View>
        ))}
      </View>
      <View className="border-b border-b-gray-400 dark:border-b-background-dark m-3"></View>
      <View className="items-end mt-3 mb-2">
        <Text className="text-md font-semibold text-mutedForeground dark:text-mutedForeground-dark">
          {daysActive} days active • {totalCompletions} total moments
        </Text>
      </View>
    </View>
  );
};
export default Timeline;
