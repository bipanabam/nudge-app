import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from "react-native-reanimated";
import { NudgeLogo } from "./NudgeLogo";

interface Props {
  onAnimationFinish: () => void;
}

export const AnimatedSplashScreen = ({ onAnimationFinish }: Props) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  useEffect(() => {
    // breathe-in pause
    const timeout = setTimeout(() => {
      scale.value = withTiming(0.9, { duration: 600 });
      opacity.value = withTiming(
        0,
        { duration: 400 },
        (finished) => {
          if (finished) runOnJS(onAnimationFinish)();
        }
      );
    }, 800);

    return () => clearTimeout(timeout);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <View
      style={StyleSheet.absoluteFill}
      className="bg-background items-center justify-center z-50"
    >
      <Animated.View style={animatedStyle}>
        <NudgeLogo size="lg" animated />
      </Animated.View>
    </View>
  );
};
