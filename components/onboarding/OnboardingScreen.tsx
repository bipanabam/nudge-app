import { ReactNode } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, { FadeInLeft, FadeInRight } from "react-native-reanimated";

type Props = {
  title: string;
  description: string;
  footerNote?: string;
  children?: ReactNode;
  primaryLabel: string;
  onPrimaryPress: () => void;
  secondaryLabel?: string;
  onSecondaryPress?: () => void;
  onSkip?: () => void;
  step?: number;
  totalSteps?: number;
};

export const OnboardingScreen = ({
  title,
  description,
  footerNote,
  children,
  primaryLabel,
  onPrimaryPress,
  secondaryLabel,
  onSecondaryPress,
  onSkip,
  step,
  totalSteps,
}: Props) => {
  return (
    <View className="flex-1 bg-background px-10 justify-center">
      <View className="gap-6">
        <Animated.View entering={FadeInRight.duration(350).delay(50)}>
          {children}
        </Animated.View>

        <Animated.Text
          entering={FadeInRight.duration(350).delay(150)}
          className="text-3xl font-bold text-foreground"
        >
          {title}
        </Animated.Text>

        <Animated.Text
          entering={FadeInLeft.duration(350).delay(300)}
          className="text-base text-mutedForeground leading-6"
        >
          {description}
        </Animated.Text>

        <View className="mt-8 gap-3">
          <Pressable
            className="bg-primary rounded-xl py-4 items-center"
            onPress={onPrimaryPress}
            style={({ pressed }) => ({
              transform: [{ scale: pressed ? 0.97 : 1 }],
            })}
          >
            <Text className="text-white font-bold text-base">
              {primaryLabel}
            </Text>
          </Pressable>

          {secondaryLabel && onSecondaryPress && (
            <Pressable onPress={onSecondaryPress}>
              <Text className="text-center text-mutedForeground">
                {secondaryLabel}
              </Text>
            </Pressable>
          )}
          {footerNote && (
            <Text className="text-sm text-mutedForeground mt-4 leading-5">
              {footerNote}
            </Text>
          )}

          {onSkip && (
            <Pressable onPress={onSkip}>
              <Text className="text-center text-xs text-mutedForeground mt-6">
                Skip for now
              </Text>
            </Pressable>
          )}
          {/* Progress dots */}
          {step !== undefined && totalSteps !== undefined && (
            <View className="flex-row justify-center mt-8 gap-2">
              {Array(totalSteps)
                .fill(0)
                .map((_, i) => (
                  <View
                    key={i}
                    className={`w-2 h-2 rounded-full ${
                      step === i ? "bg-primary scale-125" : "bg-muted"
                    }`}
                  />
                ))}
            </View>
          )}
        </View>
      </View>
    </View>
  );
};
