import React from "react";
import { Text, View } from "react-native";

const HistoryStats = ({ stats }: { stats: any }) => {
  return (
    <View className="flex-row justify-between items-center rounded-xl gap-4 bg-muted dark:bg-card-dark p-4 mb-4">
      <View>
        <Text className="text-4xl">✨</Text>
      </View>
      <View className="flex-1 flex-col">
        <Text className="text-2xl font-bold text-foreground dark:text-white mt-2">
          {stats.done} of {stats.total} done today
        </Text>
        <Text className="text-md text-mutedForeground dark:text-mutedForeground-dark">
          {stats.needsAttention} needs attention
        </Text>
      </View>
    </View>
  );
};

export default HistoryStats;
