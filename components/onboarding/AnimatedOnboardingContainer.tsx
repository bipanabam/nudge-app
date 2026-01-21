import { ReactNode } from "react";
import Animated, { FadeInRight, FadeOutLeft } from "react-native-reanimated";

export const AnimatedOnboardingContainer = ({
  children,
}: {
  children: ReactNode;
}) => {
  return (
    <Animated.View
      className="flex-1"
      entering={FadeInRight.duration(350)}
      exiting={FadeOutLeft.duration(200)}
    >
      {children}
    </Animated.View>
  );
};
