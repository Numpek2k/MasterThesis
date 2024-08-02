import {PropsWithChildren, useEffect, useState} from 'react';
import {Image, StyleSheet, useColorScheme} from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue, withRepeat, withTiming,
} from 'react-native-reanimated';

import { ThemedView } from '@/components/ThemedView';
import {aggregateRecord, initialize} from "react-native-health-connect";
import {getItemFor, storeData} from "@/helpers/storageHepler";
import * as LocalStorageKeys from "@/constants/localStorageConst";


type Props = PropsWithChildren<{
  headerBackgroundColor: { dark: string; light: string };
}>;

export default function AnimatedMainView({
  children,
  headerBackgroundColor,
}: Props) {
  const [todaySteps, setTodaySteps] = useState(0)
  const [rightValue, setRightValue] = useState('-75%'); // Default value
  const colorScheme = useColorScheme() ?? 'light';

  const translateX = useSharedValue(0);

  const initializeHealthConnect = async () => {
    const result = await initialize();
  };

  const headerImageAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const aggregateTodaySteps = async () => {
    const todayStart = getStartOfDay(getTodayDate()).toISOString();
    const todayEnd = getEndOfDay(getTodayDate()).toISOString();
    // console.log(todayStart,todayEnd)
    try {
      const result = await aggregateRecord({
        recordType: 'Steps',
        timeRangeFilter: {
          operator: 'between',
          startTime: todayStart,
          endTime: todayEnd,
        },
      })
      setTodaySteps(result.COUNT_TOTAL)
      console.log("animated view",result)
    } catch (error) {
      console.error('Failed to aggregateTodaySteps today\'s steps', error);
    }
  };

  const getStartOfDay = (date: Date): Date => {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
  };

  const getEndOfDay = (date: Date): Date => {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);
  };

  const getTodayDate = (): Date => {
    return new Date();
  };


  const calculateDistance = async () => {
    const stepTarget = await getItemFor(LocalStorageKeys.USER_DATA_DAILY_STEP_TARGET);
    const min = 30;
    const max = 75;
    let percentage = 30;
    if (stepTarget)
      percentage = min + ((todaySteps / parseInt(stepTarget)) * (max - min));
    setRightValue(`-${percentage}%`);
  }

  // useEffect(() =>{
  //   initializeHealthConnect()
  //   aggregateTodaySteps()
  // },[])
  //
  // useEffect(() =>{
  //   calculateDistance()
  // },[todaySteps])


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
                  style={[styles.gifMainCharacter, styles.character, {right: rightValue as any}]}
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
    // flex: 1,
    height:350,
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
    top: '72%',
    // right: '-75%'
  },
});
