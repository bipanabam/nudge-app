import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  return (
    <SafeAreaView>
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
    </SafeAreaView>
  );
}
