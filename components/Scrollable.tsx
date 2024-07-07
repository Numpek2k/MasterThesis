import {StyleSheet} from "react-native";
import {ThemedView} from "@/components/ThemedView";
import Animated, {useAnimatedRef} from "react-native-reanimated";
import React, {PropsWithChildren} from "react";

export function Scrollable({children}: PropsWithChildren){
  const scrollRef = useAnimatedRef<Animated.ScrollView>();

  return(
    <ThemedView style={styles.container}>
      <Animated.ScrollView style={styles.content} ref={scrollRef} scrollEventThrottle={16}>
        {children}
      </Animated.ScrollView>
    </ThemedView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
    gap: 0,
    overflow: 'hidden',
  },
  reactLogo: {
    height: '100%',
    width: null,
    aspectRatio: 7000 / 2333, // Maintain the aspect ratio of the image
  },
});
