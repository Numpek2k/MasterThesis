import {StyleSheet} from 'react-native';
import {HealthConnectStepCounter} from "@/components/HealthConnectStepCounter";
import React from "react";
import {Scrollable} from "@/components/Scrollable";

export default function HomeScreen() {

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
