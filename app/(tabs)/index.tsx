import {StyleSheet} from 'react-native';
import {HealthConnectStepCounter} from "@/components/HealthConnectStepCounter";
import React from "react";
import {ThemedView} from "@/components/ThemedView";
import Animated, {useAnimatedRef} from "react-native-reanimated";
import {Scrollable} from "@/components/Scrollable";

export default function HomeScreen() {
  const scrollRef = useAnimatedRef<Animated.ScrollView>();

  return (
    <Scrollable>
      <HealthConnectStepCounter></HealthConnectStepCounter>
    </Scrollable>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
