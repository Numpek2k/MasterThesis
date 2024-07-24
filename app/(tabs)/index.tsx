import {Button, StyleSheet} from 'react-native';
import {HealthConnectStepCounter} from "@/components/HealthConnectStepCounter";
import React from "react";
import {Scrollable} from "@/components/Scrollable";
import {ThemedView} from "@/components/ThemedView";
import {ThemedText} from "@/components/ThemedText";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function HomeScreen() {

  const clearStorage = () => {
    AsyncStorage.clear().then(() => console.log('Async storage cleared'))
  }
  return (
    <Scrollable>
      <HealthConnectStepCounter></HealthConnectStepCounter>
      <ThemedView>
        <Button
        title={'Clear'}
        onPress={clearStorage}>

        </Button>
        <ThemedText>
          some fucnkig yeaz sda
        </ThemedText>
      </ThemedView>
    </Scrollable>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
