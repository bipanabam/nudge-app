import { Text, View } from "react-native";

export default function Index() {
  return (
    <View className="bg-background p-4 rounded-xl">
      <Text className="text-foreground font-semibold">
        Nudge
      </Text>

      <View className="bg-laundry-bg mt-4 p-3 rounded-lg">
        <Text className="text-laundry-fg">
          Laundry routine
        </Text>
      </View>
    </View>
  );
}
