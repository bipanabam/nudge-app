import Animated, {
  FadeInUp,
  useSharedValue,
  withRepeat,
  withTiming,
  useAnimatedStyle,
} from "react-native-reanimated";
import { useEffect } from "react";
import { Text, View } from "react-native";

const FloatingIcon = ({ icon, delay }: { icon: string; delay: number }) => {
  const y = useSharedValue(0);

  useEffect(() => {
    y.value = withRepeat(
      withTiming(-6, { duration: 1200 }),
      -1,
      true
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: y.value }],
  }));

  return (
    <Animated.View
      entering={FadeInUp.delay(delay).duration(400)}
      style={style}
      className="bg-muted rounded-2xl w-14 h-14 items-center justify-center"
    >
      <Text className="text-2xl">{icon}</Text>
    </Animated.View>
  );
};
export default FloatingIcon;