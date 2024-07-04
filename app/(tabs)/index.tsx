import { Image, StyleSheet, Platform } from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import HealthConnect from "@/components/HealthConnect";
import {initialize} from "react-native-health-connect";
import {useEffect} from "react";
import {HealthConnectStepCounter} from "@/components/HealthConnectStepCounter";

export default function HomeScreen() {

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/3294.jpg')}
          style={styles.reactLogo}
        />
      }>
      <HealthConnectStepCounter></HealthConnectStepCounter>

    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: '100%',
    width: 700,
    bottom: 0,
    left: -100,
    position: 'absolute',
  },
});
