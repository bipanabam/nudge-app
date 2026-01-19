import clsx from "clsx";
import { ChevronRight } from "lucide-react-native";
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
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || !onPress}
      className={clsx(
        "flex-row items-center gap-3 p-4",
        disabled ? "opacity-50" : "active:bg-muted",
      )}
    >
      <View
        className={clsx(
          "p-2 rounded-2xl",
          destructive
            ? "bg-destructive/20"
            : highlight
              ? "bg-primary/20"
              : "bg-secondary",
        )}
      >
        <Icon
          size={20}
          color={destructive ? "red" : "black"}
          className={clsx(
            destructive
              ? "text-destructive"
              : highlight
                ? "text-primary"
                : "text-secondaryForeground",
          )}
        />
      </View>

      <Text
        className={clsx(
          "flex-1 font-semibold text-lg",
          destructive ? "text-destructive" : "text-foreground",
        )}
      >
        {label}
      </Text>

      {value && <Text className="text-md text-mutedForeground">{value}</Text>}

      {onPress && !disabled && (
        <ChevronRight size={18} className="text-mutedForeground" />
      )}
    </Pressable>
  );
}
