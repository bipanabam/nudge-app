import { NudgeLogo } from "@/components/NudgeLogo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import { Moon, Sun } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { Pressable, Text, View } from "react-native";

interface HeaderProps {
  title?: string;
  subtitle?: string;
}

const Header = ({ title, subtitle }: HeaderProps) => {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  // Dynamic greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning 👋";
    if (hour < 18) return "Good afternoon 👋";
    return "Good evening 👋";
  };

  const handleToggle = () => {
    const next = isDark ? "light" : "dark";
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleColorScheme();
    AsyncStorage.setItem("theme", next);
  };

  return (
    <View className="flex-1 flex-col mt-4 mb-6 gap-1">
      <View className="flex-1 flex-row items-center justify-between">
        <View className="flex-1 flex-col items-start gap-1">
          <Text className="text-foreground text-sm dark:text-mutedForeground">
            {getGreeting()}
          </Text>
          <NudgeLogo />
        </View>

        <Pressable
          onPress={handleToggle}
          className="rounded-lg w-12 h-12 bg-muted dark:bg-card-dark items-center justify-center ml-4"
        >
          {isDark ? (
            <Sun size={24} color="#F2B45A" />
          ) : (
            <Moon size={24} color="#6A7C75" />
          )}
        </Pressable>
      </View>

      {title && (
        <Text className="text-2xl font-bold text-foreground dark:text-white mt-2">
          {title}
        </Text>
      )}
      {subtitle && (
        <Text className="text-md text-mutedForeground dark:text-mutedForeground-dark">
          {subtitle}
        </Text>
      )}
    </View>
  );
};

export default Header;
