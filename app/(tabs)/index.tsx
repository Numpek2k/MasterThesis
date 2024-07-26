import {Button, StyleSheet} from 'react-native';
import {HealthConnectStepCounter} from "@/components/HealthConnectStepCounter";
import React from "react";
import {Scrollable} from "@/components/Scrollable";
import {ThemedView} from "@/components/ThemedView";
import {ThemedText} from "@/components/ThemedText";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {Locales} from "@expo/config-plugins/build/ios";
import * as LocalStorageKeys from "@/constants/localStorageConst";
import {storeData} from "@/helpers/storageHepler";
import {nutritionJournalTestData} from "@/interfaces/nutritionJournal";
import uuid from 'react-native-uuid';

export default function HomeScreen() {

  const clearStorage = () => {
    // AsyncStorage.removeItem(LocalStorageKeys.USER_ACTIVITIES_JOURNAL)
    // AsyncStorage.clear().then(() => console.log('Async storage cleared'))
    // storeData(LocalStorageKeys.USER_CALORIES_JOURNAL,JSON.stringify(nutritionJournalTestData))
    // const id = uuid.v4().toString();
    // console.log(id)
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
