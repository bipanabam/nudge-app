import { BellOff, BellRing } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

import { useNotifications } from "@/app/context/NotificationsContext";
import Toast from "react-native-toast-message";

const STORAGE_KEY = "notificationsEnabled";

export function SettingsBanner() {
  const { enabled, loading, toggle } = useNotifications();

  if (loading) return null;

  const handlePress = async () => {
    const prev = enabled;
    await toggle();

    if (!prev && !enabled) {
      // permission denied
      Toast.show({
        type: "error",
        text1: "Permission denied",
        text2:
          "Enable notifications in your device settings to receive reminders.",
      });
    } else if (!prev && enabled) {
      Toast.show({
        type: "success",
        text1: "Notifications enabled",
        text2: "You’ll receive reminders even when the app is closed.",
      });
    } else if (prev && !enabled) {
      Toast.show({
        type: "info",
        text1: "Notifications disabled",
        text2: "You will no longer receive reminders.",
      });
    }
  };

  if (loading) return null;

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
            onPress={handlePress}
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
