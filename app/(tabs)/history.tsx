import { Feather } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { EventRegister } from "react-native-event-listeners";
import { SafeAreaView } from "react-native-safe-area-context";

import Header from "@/components/Header";
import { formatStringToDate, formatTime12h } from "@/hooks/helpers";
import { getHistory } from "@/storage/historyStorage";
import { RoutineHistory } from "@/types/history";
import { getRoutineIcon } from "@/types/routine";

const formatTime = (date: Date) =>
  date.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });

const History = () => {
  const [history, setHistory] = useState<RoutineHistory[]>([]);

  useEffect(() => {
    loadHistory();
    const callback = () => loadHistory();
    EventRegister.addEventListener("historyUpdated", callback);

    return () => {
      EventRegister.removeEventListener("historyUpdated");
    };
  }, []);

  const loadHistory = async () => {
    const data = await getHistory();
    setHistory(data);
  };

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
      edges={["top"]}
      className="flex-1 bg-background dark:bg-background-dark"
    >
      <View className="flex-1 p-4 rounded-xl">
        <ScrollView
          className="flex-1 px-5"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 80 }}
        >
          {/* Header */}
          <Header title="Activity History" subtitle="Your completed routines" />

          {/* History */}
          {history.length === 0 && (
            <View className="mt-10 items-center">
              <Text className="text-mutedForeground text-sm">
                No routines completed yet 🌱
              </Text>
            </View>
          )}

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
                  className="bg-card dark:bg-card-dark rounded-xl p-4 mb-3 flex-row justify-between items-center"
                >
                  <View className="flex-row items-center gap-3">
                    <Text className="text-2xl">
                      {getRoutineIcon(item.type)}
                    </Text>

                    <View>
                      <Text className="text-lg font-semibold text-foreground dark:text-white">
                        {item.name}
                      </Text>
                      <Text className="text-sm text-mutedForeground">
                        {formatTime12h(formatTime(item.completedAt))}
                      </Text>
                    </View>
                  </View>
                  <View className="flex-row items-center justify-center gap-1">
                    <Feather name="check" size={18} color="#7FAE9A" />
                    <Text className="font-semibold text-md capitalize text-primary">
                      Done
                    </Text>
                  </View>

                  {/* <Text className="text-green-600 font-semibold">✓ Done</Text> */}
                </View>
              ))}
            </View>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default History;
