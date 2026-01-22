import clsx from "clsx";
import { ChevronRight } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { Pressable, Text, View } from "react-native";

export function SettingsItem({
  icon: Icon,
  label,
  value,
  onPress,
  disabled,
  destructive,
  highlight,
}: {
  icon: any;
  label: string;
  value?: string;
  onPress?: () => void;
  disabled?: boolean;
  destructive?: boolean;
  highlight?: boolean;
}) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const iconColor = destructive
    ? isDark
      ? "#F87171"
      : "#DC2626"
    : isDark
      ? "#FFFFFF"
      : "#2F3A36";

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || !onPress}
      android_ripple={{
        color: "rgba(255,255,255,0.08)", // subtle ripple for dark mode
        borderless: false,
      }}
      className={clsx(
        "flex-row items-center gap-3 p-4 rounded-2xl overflow-hidden",
        disabled ? "opacity-50" : "active:bg-muted dark:active:bg-foreground",
      )}
    >
      <View
        className={clsx(
          "p-2 rounded-2xl",
          destructive
            ? "bg-destructive/20 dark:bg-destructive-dark/20"
            : highlight
              ? "bg-primary/20 dark:bg-foreground"
              : "bg-secondary dark:bg-foreground",
        )}
      >
        <Icon size={20} color={iconColor} />
      </View>

      <Text
        className={clsx(
          "flex-1 font-semibold text-lg",
          destructive
            ? "text-destructive dark:text-destructive-dark"
            : "text-foreground dark:text-white",
        )}
      >
        {label}
      </Text>

      {value && <Text className="text-md text-mutedForeground">{value}</Text>}

      {onPress && !disabled && (
        <ChevronRight
          size={18}
          color={iconColor}
          className="text-mutedForeground"
        />
      )}
    </Pressable>
  );
}
