import { Text, View } from "react-native";

export function SettingsSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View>
      <Text className="text-sm font-bold text-mutedForeground mb-3 px-1">
        {title}
      </Text>

      <View className="bg-card rounded-2xl divide-y border-mutedForeground">
        {children}
      </View>
    </View>
  );
}
