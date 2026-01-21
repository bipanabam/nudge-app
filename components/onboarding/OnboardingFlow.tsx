import { NudgeLogo } from "@/components/NudgeLogo";
import { useNotifications } from "@/context/NotificationsContext";
import { useOnboarding } from "@/hooks/useOnboarding";
import { Bell } from "lucide-react-native";
import { Text, View } from "react-native";
import Animated, { FadeInRight, FadeOutLeft } from "react-native-reanimated";

import FloatingIcon from "@/components/FloatingIcon";
import { AnimatedOnboardingContainer } from "./AnimatedOnboardingContainer";
import { OnboardingScreen } from "./OnboardingScreen";

export const OnboardingFlow = () => {
  const { step, saveStep, finish } = useOnboarding();
  const { toggle } = useNotifications();

  if (step === null) return null;

  // Screen 1: Welcome
  if (step === 0) {
    return (
      <AnimatedOnboardingContainer>
        <OnboardingScreen
          title="Welcome to Nudge 🌱"
          description="A gentle companion for small routines — no pressure, no guilt."
          primaryLabel="Let’s begin"
          onPrimaryPress={() => saveStep(1)}
          onSkip={finish}
          step={step}
          totalSteps={3}
        >
          <Animated.View
            entering={FadeInRight.duration(400).delay(100)}
            exiting={FadeOutLeft.duration(300)}
            className="items-center mb-6"
          >
            <NudgeLogo />
          </Animated.View>
        </OnboardingScreen>
      </AnimatedOnboardingContainer>
    );
  }

  // Screen 2: Notifications
  if (step === 1) {
    return (
      <AnimatedOnboardingContainer key={step}>
        <OnboardingScreen
          title="Stay on track"
          description="We'll send a tiny nudge when your plants need water or your dog needs a treat."
          primaryLabel="Enable gentle nudges"
          secondaryLabel="Maybe later"
          onPrimaryPress={async () => {
            const success = await toggle();
            saveStep(2);
          }}
          onSecondaryPress={() => saveStep(2)}
          onSkip={finish}
          step={step}
          totalSteps={3}
        >
          <View className="items-center w-full">
            {/* Visual Mockup of a Notification */}
            <View className="bg-card border border-primary rounded-2xl p-4 w-64 shadow-sm flex-row items-center gap-3">
              <View className="bg-primary/20 p-2 rounded-lg">
                <Bell size={20} color="#2F3A36" />
              </View>
              <View>
                <Text className="font-bold text-xs">Nudge 🌱</Text>
                <Text className="text-xs text-mutedForeground">
                  Time to water your Monstera!
                </Text>
              </View>
            </View>
          </View>
        </OnboardingScreen>
      </AnimatedOnboardingContainer>
    );
  }

  // Screen 3: Get started
  return (
    <AnimatedOnboardingContainer>
      <OnboardingScreen
        title="You’re all set ✨"
        description="Start by adding something you care about — a plant, a pet, or a small habit."
        primaryLabel="Add your first routine"
        onPrimaryPress={finish}
        step={step}
        totalSteps={3}
      >
        {/* <View className="items-center mb-4">
          <Text className="text-5xl">🐾</Text>
        </View> */}
        <View className="flex-row justify-center gap-4 mb-6">
          <FloatingIcon icon="🌱" delay={0} />
          <FloatingIcon icon="🐶" delay={100} />
          <FloatingIcon icon="🧺" delay={200} />
          <FloatingIcon icon="🗑️" delay={300} />
        </View>
      </OnboardingScreen>
    </AnimatedOnboardingContainer>
  );
};
