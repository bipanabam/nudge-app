import { Text, View } from "react-native";

interface NudgeLogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  animated?: boolean;
}

export function NudgeLogo({
  size = "md",
  showText = true,
  animated = false,
}: NudgeLogoProps) {
  const sizes = {
    sm: { circle: 24, dot: 8, text: "text-lg" },
    md: { circle: 32, dot: 10, text: "text-xl" },
    lg: { circle: 48, dot: 14, text: "text-3xl" },
  };

  const { circle, dot, text } = sizes[size];

  return (
    <View className="flex-row items-center gap-2">
      <View
        className={`relative ${animated ? "animate-pulse" : ""}`}
        style={{ width: circle + dot / 2, height: circle }}
      >
        <View
          className="absolute bg-primary rounded-full"
          style={{
            width: circle,
            height: circle,
            right: 0,
            top: 0,
          }}
        />

        <View
          className="absolute bg-foreground rounded-full"
          style={{
            width: dot,
            height: dot,
            left: 0,
            top: 0,
          }}
        />
      </View>

      {showText && (
        <Text
          className={`font-extrabold text-foreground dark:text-white tracking-tight ${text}`}
        >
          Nudge
        </Text>
      )}
    </View>
  );
}
