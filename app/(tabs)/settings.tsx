import { Bell, Clock, Info, Smartphone, Trash2 } from "lucide-react-native";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useNotifications } from "@/app/context/NotificationsContext";
import { NudgeLogo } from "@/components/NudgeLogo";
import { SettingsBanner } from "@/components/settings/SettingsBanner";
import { SettingsItem } from "@/components/settings/SettingsItem";
import { SettingsSection } from "@/components/settings/SettingsSection";
import { scheduleNotification } from "@/utils/notifications";

const testNotification = async () => {
  const date = new Date(Date.now() + 10000); // 10 seconds later
  await scheduleNotification(
    "Test",
    "Notifications are working!",
    date,
    "test-id",
  );
};

export default function Settings() {
  const { enabled: notificationsEnabled } = useNotifications();

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
              Settings
            </Text>
            <Text className="text-md text-mutedForeground">
              Customize your experience
            </Text>
          </View>

          {/* Banner */}
          <SettingsBanner />

          <View className="mt-8 gap-8">
            <SettingsSection title="Notifications">
              <SettingsItem
                icon={Bell}
                label="Push Notifications"
                value={notificationsEnabled ? "On" : "Off"}
                highlight={!notificationsEnabled}
                onPress={testNotification}
              />
              <SettingsItem
                icon={Clock}
                label="Quiet Hours"
                value="10 PM – 7 AM"
                disabled={!notificationsEnabled}
                onPress={() => {}}
              />
            </SettingsSection>

            <SettingsSection title="Data">
              <SettingsItem
                icon={Trash2}
                label="Clear History"
                destructive
                onPress={() => {}}
              />
            </SettingsSection>

            <SettingsSection title="About">
              <SettingsItem icon={Info} label="Version" value="1.0.0" />
              <SettingsItem
                icon={Smartphone}
                label="Made with Nudge"
                onPress={() => {}}
              />
            </SettingsSection>
          </View>

          <Text className="text-xs text-mutedForeground text-center mt-10">
            Nudge • Local-first & Privacy-focused
          </Text>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
