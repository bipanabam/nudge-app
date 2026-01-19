import React from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { NudgeLogo } from "@/components/NudgeLogo";

const History = () => {
  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-background">
      <View className="flex-1 p-4 rounded-xl">
        <ScrollView
          className="flex-1 px-5"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 80 }}
        >
          {/* Header */}
          <View className="mt-4 mb-6 gap-1">
            <Text className="text-foreground text-sm">Good afternoon 👋</Text>
            <NudgeLogo />
            <Text className="text-2xl font-bold text-foreground mt-2">
              Activity History
            </Text>
            <Text className="text-md text-mutedForeground">
              Your completed routines
            </Text>
          </View>

          {/* History */}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default History;
