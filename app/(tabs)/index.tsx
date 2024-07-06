import { Image, StyleSheet, Platform } from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import HealthConnect from "@/components/HealthConnect";
import {initialize} from "react-native-health-connect";
import {useEffect} from "react";
import {HealthConnectStepCounter} from "@/components/HealthConnectStepCounter";
import {WalkingZombie} from "@/components/WalkingZombie";

export default function HomeScreen() {

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/3294.jpg')}
          style={styles.reactLogo}
          resizeMode="contain"
        />
      }>
      <HealthConnectStepCounter></HealthConnectStepCounter>

    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  reactLogo: {
    height: '100%',
    width: null,
    aspectRatio: 7000 / 2333, // Maintain the aspect ratio of the image
  },
});
