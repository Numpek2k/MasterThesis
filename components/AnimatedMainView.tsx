import {PropsWithChildren, useEffect} from 'react';
import {Image, StyleSheet, useColorScheme} from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue, withRepeat, withTiming,
} from 'react-native-reanimated';

import { ThemedView } from '@/components/ThemedView';


type Props = PropsWithChildren<{
  headerBackgroundColor: { dark: string; light: string };
}>;

export default function AnimatedMainView({
  children,
  headerBackgroundColor,
}: Props) {
  const colorScheme = useColorScheme() ?? 'light';

  const translateX = useSharedValue(0);

  const headerImageAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  useEffect(() => {
    translateX.value = withRepeat(
        withTiming(-1050, { duration: 30000, easing: Easing.linear}, ), // Move from 0 to -500 over 10 seconds
        -1,
        false,
    );
  }, [translateX]);

  return (
    <ThemedView style={styles.container}>
        <Animated.View
          style={[
            styles.header,
            { backgroundColor: headerBackgroundColor[colorScheme] },
            // headerAnimatedStyle,
          ]}>
          <Animated.View>
            <Animated.View style={[styles.headerImageContainer, headerImageAnimatedStyle]}>
              <Image
                source={require('@/assets/images/mainScrean/3294.jpg')}
                style={styles.background}
                resizeMode="contain"
              />
              <Animated.View style={styles.secondImage}>
                <Image
                  source={require('@/assets/images/mainScrean/3294.jpg')}
                  style={styles.background}
                  resizeMode="contain"
                />
              </Animated.View>
            </Animated.View>
            <Animated.View style={styles.gifOverlay}>
              <Image
                  source={require('../assets/images/mainScrean/walking_zombie.gif')}
                  style={[styles.gifZombie, styles.zombie1]}
              />
            </Animated.View>
            <Animated.View style={styles.gifOverlay}>
              <Image
                  source={require('../assets/images/mainScrean/walking_zombie.gif')}
                  style={[styles.gifZombie, styles.zombie2]}
              />
            </Animated.View>
            <Animated.View style={styles.gifOverlay}>
              <Image
                  source={require('../assets/images/mainScrean/walking_zombie.gif')}
                  style={[styles.gifZombie, styles.zombie3]}
              />
            </Animated.View>
            <Animated.View style={styles.gifOverlay}>
              <Image
                  source={require('../assets/images/mainScrean/walking_zombie.gif')}
                  style={[styles.gifZombie, styles.zombie4]}
              />
            </Animated.View>
            <Animated.View style={styles.gifOverlay}>
              <Image
                  source={require('../assets/images/mainScrean/walking_zombie.gif')}
                  style={[styles.gifZombie, styles.zombie5]}
              />
            </Animated.View>
            <Animated.View style={styles.gifOverlay}>
              <Image
                  source={require('../assets/images/mainScrean/walking_zombie.gif')}
                  style={[styles.gifZombie, styles.zombie6]}
              />
            </Animated.View>
            <Animated.View style={styles.gifOverlay}>
              <Image
                  source={require('../assets/images/mainScrean/male_run.gif')}
                  style={[styles.gifMainCharacter, styles.character]}
              />
            </Animated.View>
          </Animated.View>
        </Animated.View>
        <ThemedView style={styles.content}>{children}</ThemedView>
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
  background: {
    height: '100%',
    width: null,
    aspectRatio: 7000 / 2333, // Maintain the aspect ratio of the image
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
    paddingVertical: 32,
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
    top: '75%',
    left: 10
  },
  zombie2: {
    top: '84%',
    left: 30
  },
  zombie3: {
    top: '80%',
    left: 45
  },
  zombie4: {
    top: '82%',
    left: 15
  },
  zombie5: {
    top: '76%',
    left: 60
  },
  zombie6: {
    top: '80%',
    left: 70
  },
  character: {
    top: '74%',
    right: '-75%'
  },
});
