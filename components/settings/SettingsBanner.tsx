import { BellOff, BellRing } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

export function SettingsBanner({
  enabled,
  onEnable,
}: {
  enabled: boolean;
  onEnable?: () => void;
}) {
  return (
    <View
      className={`
        rounded-2xl p-4 flex-row gap-3
        ${enabled ? "bg-plant/10" : "bg-primary/10"}
      `}
    >
      <View
        className={`
          p-2 rounded-2xl h-11 w-11 items-center justify-center
          ${enabled ? "bg-plant/20" : "bg-primary/20"}
        `}
      >
        {enabled ? (
          <BellRing size={20} color={"#7eae99"} className="text-plant" />
        ) : (
          <BellOff size={20} color={"#7eae99"} className="text-primary" />
        )}
      </View>

      <View className="flex-1">
        <Text className="font-semibold text-xl text-foreground">
          {enabled ? "Notifications enabled" : "Notifications are off"}
        </Text>

        <Text className="text-md text-mutedForeground mt-0.5">
          {enabled
            ? "You’ll receive reminders even when the app is closed."
            : "Enable notifications to get reminded when routines are due."}
        </Text>

        {!enabled && (
          <Pressable
            onPress={onEnable}
            className="mt-3 self-start px-4 py-2 bg-primary rounded-2xl"
          >
            <Text className="text-primaryForeground font-semibold text-md">
              Enable Notifications
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}
