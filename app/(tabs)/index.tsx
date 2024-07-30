import {Button, StyleSheet} from 'react-native';
import {HealthConnectStepCounter} from "@/components/HealthConnectStepCounter";
import React from "react";
import {Scrollable} from "@/components/Scrollable";
import {ThemedView} from "@/components/ThemedView";
import {ThemedText} from "@/components/ThemedText";
import {EventEmitter} from "events"
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as LocalStorageKeys from "@/constants/localStorageConst"
import {aggregateRecord} from "react-native-health-connect";

export default function HomeScreen() {

  const clearStorage = async () => {
    // AsyncStorage.removeItem(LocalStorageKeys.USER_ACTIVITIES_JOURNAL)
    // AsyncStorage.clear().then(() => console.log('Async storage cleared'))
    // storeData(LocalStorageKeys.USER_CALORIES_JOURNAL,JSON.stringify(nutritionJournalTestData))
    // const id = uuid.v4().toString();
    // console.log(id)
    // console.log(new Date().toISOString().split('T')[0])
    // AsyncStorage.setItem(LocalStorageKeys.FIRST_LAUNCHED_DATE, "2024-07-26").then(() => console.log('yes'))
    AsyncStorage.removeItem(LocalStorageKeys.LAST_ACTIVITY_JOURNAL_UPDATE).then(() => console.log(AsyncStorage.getItem(LocalStorageKeys.LAST_ACTIVITY_JOURNAL_UPDATE)))
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
