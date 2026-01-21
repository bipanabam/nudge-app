import React from "react";
import { StyleSheet, View } from "react-native";
import Animated, { ZoomOut, runOnJS } from "react-native-reanimated";
import { NudgeLogo } from "./NudgeLogo";

interface Props {
  onAnimationFinish: () => void;
}

export const AnimatedSplashScreen = ({ onAnimationFinish }: Props) => {
  return (
    <View
      style={StyleSheet.absoluteFill}
      className="bg-background items-center justify-center"
    >
      <Animated.View
        // This "pops" the logo slightly before fading out
        exiting={ZoomOut.duration(600).withCallback((finished) => {
          if (finished) runOnJS(onAnimationFinish)();
        })}
      >
        <NudgeLogo size="lg" animated />
      </Animated.View>
    </View>
  );
};
