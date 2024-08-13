import {Button, StyleSheet} from 'react-native';
import {HealthConnectStepCounter} from "@/components/homePage/HealthConnectStepCounter";
import React, {useCallback, useState} from "react";
import {Scrollable} from "@/components/Scrollable";
import {ThemedView} from "@/components/ThemedView";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as LocalStorageKeys from "@/constants/localStorageConst"
import UserInformation from "@/components/homePage/userInformation";
import {getItemFor, storeData} from "@/helpers/storageHepler";
import {useFocusEffect} from "@react-navigation/native";
import {UsageJournal} from "@/interfaces/usageJournal";

export default function HomeScreen() {
  const [todaySteps, setTodaySteps] = useState(0);
  const [streakReset, setStreakReset] = useState(false);
  const [updated, setUpdated] = useState(false);

  const clearStorage = async () => {
    // AsyncStorage.removeItem(LocalStorageKeys.USER_ACTIVITIES_JOURNAL)
    // AsyncStorage.clear().then(() => console.log('Async storage cleared'))
    // storeData(LocalStorageKeys.USER_CALORIES_JOURNAL,JSON.stringify(nutritionJournalTestData))
    // const id = uuid.v4().toString();
    // console.log(id)
    // console.log(new Date().toISOString().split('T')[0])
    // AsyncStorage.setItem(LocalStorageKeys.FIRST_LAUNCHED_DATE, "2024-07-30").then(() => console.log('yes'))
    // AsyncStorage.removeItem(LocalStorageKeys.LAST_ACTIVITY_JOURNAL_UPDATE).then(() => console.log(AsyncStorage.getItem(LocalStorageKeys.LAST_ACTIVITY_JOURNAL_UPDATE)))
    // storeData(LocalStorageKeys.USER_HEALTH,'100')
    // getItemFor(LocalStorageKeys.USER_STREAK).then((res) => console.log(res))
    // storeData(LocalStorageKeys.USER_ACTIVITIES_JOURNAL,'{"journal":[{"date":"2024-07-26","dailySteps":3598,"items":[]},{"date":"2024-07-27","dailySteps":10388,"items":[]},{"date":"2024-07-28","dailySteps":4589,"items":[]},{"date":"2024-07-29","dailySteps":1006,"items":[]},{"date":"2024-07-30","dailySteps":3872,"items":[{"id":"9f1c684b-9dd2-4195-8bc2-08e4ef93b32a","type":"RUNNING","amount":50,"points":37500},{"id":"11fbaef7-2bd6-4315-ac8c-4a358da7f96a","type":"RUNNING","amount":50,"points":37500}]},{"date":"2024-07-31","dailySteps":0,"items":[{"id":"bb344468-cace-488a-b6e8-2bd6cdabd3ee","type":"RUNNING","amount":50,"points":37500}]}]}')
    // storeData(LocalStorageKeys.USER_HEALTH, '0')
  }

  const handleTodayStepsUpdate = (steps: number) => {
    setTodaySteps(steps);
  };
  const onStreakReset = () => {
    setStreakReset(true)
  }
  const onUpdate = () => {
    setUpdated(true)
  }
  const annotateUsage = async () => {
    try{
      const journalString = await getItemFor(LocalStorageKeys.USER_LOGIN_JOURNAL);
      let journal: UsageJournal
      if (journalString) {
        journal = JSON.parse(journalString);
      } else {
        const username = await getItemFor(LocalStorageKeys.USER_DATA_USERNAME);
        if(username)
          journal = {
            username: username,
            login_dates: []
          };
        else
          journal = {
            username: 'EMPTYUSERNAME',
            login_dates: []
          };
      }

      journal.login_dates.push(new Date())
      console.log(JSON.stringify(journal))
      await storeData(LocalStorageKeys.USER_LOGIN_JOURNAL, JSON.stringify(journal))
    } catch (error) {
      console.error("Error fetching login journal data:", error);
    }
  }

  useFocusEffect(
    useCallback(() => {
      annotateUsage();
    }, [])
  );

  return (
    <Scrollable>
      <HealthConnectStepCounter onUpdate={onUpdate} onStreakReset={onStreakReset} onTodayStepsUpdate={handleTodayStepsUpdate} />
      {/*<ThemedView>*/}
      {/*  <Button*/}
      {/*  title={'Clear'}*/}
      {/*  onPress={clearStorage}>*/}
      {/*  </Button>*/}
      {/*</ThemedView>*/}
      <UserInformation
        userSteps={todaySteps}
        streakReset ={streakReset}
        updated={updated}
      />
    </Scrollable>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
