import * as Haptics from "expo-haptics";
import { ReactNode } from "react";
import { Pressable, Text, View } from "react-native";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import Animated, { FadeIn, FadeInUp } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

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
  const handlePress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPrimaryPress();
  };

  const onGestureEvent = (event: any) => {
    // Detect swipe left to progress
    if (
      event.nativeEvent.translationX < -100 &&
      event.nativeEvent.state === State.END
    ) {
      handlePress();
    }
  };
  return (
    <PanGestureHandler onHandlerStateChange={onGestureEvent}>
      <SafeAreaView className="flex-1 bg-background items-center justify-center px-10 pb-8">
        <View className="flex-1 px-8 pt-12">
          {/* Progress Header */}
          <View className="flex-row justify-center gap-2 mb-12">
            {Array(totalSteps)
              .fill(0)
              .map((_, i) => (
                <View
                  key={i}
                  className={`h-1.5 rounded-full ${step === i ? "w-6 bg-primary" : "w-2 bg-muted"}`}
                />
              ))}
          </View>
          {/* Hero Content */}
          <View className="items-center justify-center flex-1">
            <Animated.View entering={FadeInUp.delay(200).duration(500)}>
              {children}
            </Animated.View>

            <Animated.View entering={FadeInUp.delay(400)} className="mt-10">
              <View className="items-center">
                <Text className="text-3xl font-bold text-foreground text-center tracking-tight">
                  {title}
                </Text>
                <Text className="text-lg text-mutedForeground text-center mt-4 leading-7 px-2">
                  {description}
                </Text>
              </View>
            </Animated.View>
          </View>

          {/* Action Footer */}
          <View className="pb-5 gap-5">
            <Animated.View entering={FadeIn.delay(500)}>
              <View>
                <Pressable
                  onPress={handlePress}
                  style={({ pressed }) => ({
                    transform: [{ scale: pressed ? 0.98 : 1 }],
                  })}
                  className="bg-primary rounded-2xl py-4 items-center shadow-lg"
                >
                  <Text className="text-white font-bold text-lg">
                    {primaryLabel}
                  </Text>
                </Pressable>
              </View>
            </Animated.View>

            {secondaryLabel && (
              <Pressable onPress={onSecondaryPress} className="py-2">
                <Text className="text-center text-mutedForeground font-medium">
                  {secondaryLabel}
                </Text>
              </Pressable>
            )}

            {onSkip && (
              <Pressable
                onPress={onSkip}
                hitSlop={20}
                className="active:opacity-50 items-center"
              >
                <Text className="text-sm font-semibold text-mutedForeground">
                  Skip
                </Text>
              </Pressable>
            )}
          </View>
          {footerNote && (
            <Text className="text-sm text-mutedForeground mt-4 leading-5">
              {footerNote}
            </Text>
          )}
        </View>
      </SafeAreaView>
    </PanGestureHandler>
  );
};
