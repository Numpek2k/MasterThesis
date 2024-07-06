import {PropsWithChildren, ReactElement, useEffect} from 'react';
import {Image, StyleSheet, useColorScheme, View} from 'react-native';
import Animated, {
  Easing,
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset, useSharedValue, withRepeat, withTiming,
} from 'react-native-reanimated';

import { ThemedView } from '@/components/ThemedView';

const HEADER_HEIGHT = 250;

type Props = PropsWithChildren<{
  headerImage: ReactElement;
  headerBackgroundColor: { dark: string; light: string };
}>;

export default function ParallaxScrollView({
  children,
  headerImage,
  headerBackgroundColor,
}: Props) {
  const colorScheme = useColorScheme() ?? 'light';
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(scrollRef);

  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
            [-HEADER_HEIGHT / 2, 0, HEADER_HEIGHT * 0.75]
          ),
        },
        {
          scale: interpolate(scrollOffset.value, [-HEADER_HEIGHT, 0, HEADER_HEIGHT], [2, 1, 1]),
        },
      ],
    };
  });

  // Shared value for horizontal animation
  const translateX = useSharedValue(0);

  // Animated style for header image
  const headerImageAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  // Start the animation loop
  useEffect(() => {
    translateX.value = withRepeat(
        withTiming(-1050, { duration: 30000, easing: Easing.linear}, ), // Move from 0 to -500 over 10 seconds
        -1, // Repeat indefinitely
        false, // Do not reverse direction

    );
  }, [translateX]);

  return (
    <ThemedView style={styles.container}>
      <Animated.ScrollView ref={scrollRef} scrollEventThrottle={16}>
        <Animated.View
          style={[
            styles.header,
            { backgroundColor: headerBackgroundColor[colorScheme] },
            headerAnimatedStyle,
          ]}>
          <Animated.View style={[styles.headerImageContainer, headerImageAnimatedStyle]}>
            {headerImage}
            <View style={styles.secondImage}>
              {headerImage}
            </View>
          </Animated.View>
        </Animated.View>
        <Animated.View style={styles.gifOverlay}>
          <Image
              source={require('@/assets/images/walking_zombie.gif')}
              style={[styles.gifZombie, styles.zombie1]}
          />
        </Animated.View>
        <Animated.View style={styles.gifOverlay}>
          <Image
              source={require('@/assets/images/walking_zombie.gif')}
              style={[styles.gifZombie, styles.zombie2]}
          />
        </Animated.View>
        <Animated.View style={styles.gifOverlay}>
          <Image
              source={require('@/assets/images/walking_zombie.gif')}
              style={[styles.gifZombie, styles.zombie3]}
          />
        </Animated.View>
        <Animated.View style={styles.gifOverlay}>
          <Image
              source={require('@/assets/images/walking_zombie.gif')}
              style={[styles.gifZombie, styles.zombie4]}
          />
        </Animated.View>
        <Animated.View style={styles.gifOverlay}>
          <Image
              source={require('@/assets/images/walking_zombie.gif')}
              style={[styles.gifZombie, styles.zombie5]}
          />
        </Animated.View>
        <Animated.View style={styles.gifOverlay}>
          <Image
              source={require('@/assets/images/walking_zombie.gif')}
              style={[styles.gifZombie, styles.zombie6]}
          />
        </Animated.View>
        <Animated.View style={styles.gifOverlay}>
          <Image
              source={require('@/assets/images/male_run.gif')}
              style={[styles.gifMainCharacter, styles.character]}
          />
        </Animated.View>
        <ThemedView style={styles.content}>{children}</ThemedView>
      </Animated.ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  secondImage: {
    left: -1.5
  },
  header: {
    height: 350,
    overflow: 'hidden',
  },
  headerImageContainer: {
    width: 14000, // Double the width of the image to allow for smooth looping
    height: '100%',
    left: -10,
    flexDirection: 'row', // Arrange images side by side
  },
  content: {
    flex: 1,
    padding: 32,
    gap: 0,
    overflow: 'hidden',
  },
  gifOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  gifZombie: {
    width: 48,
    height: 48
  },
  gifMainCharacter: {
    width: 80,
    height: 80
  },
  zombie1: {
    top: '59%',
    left: 10
  },
  zombie2: {
    top: '68%',
    left: 30
  },
  zombie3: {
    top: '64%',
    left: 45
  },
  zombie4: {
    top: '66%',
    left: 15
  },
  zombie5: {
    top: '60%',
    left: 60
  },
  zombie6: {
    top: '64%',
    left: 70
  },
  character: {
    top: '58%',
    right: '-75%'
  },
});
