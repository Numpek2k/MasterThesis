import {Pressable, StyleSheet, View, Clipboard} from 'react-native';
import {ThemedText} from '@/components/ThemedText';
import {Scrollable} from "@/components/Scrollable";
import {WeeklyRankBoard} from "@/constants/weeklyRankConst";
import RankElement from "@/components/weeklyRank/RankElement";
import {useCallback, useEffect, useState} from "react";
import {ActivityJournal} from "@/interfaces/activityJournal";
import {getItemFor} from "@/helpers/storageHepler";
import * as LocalStorageKeys from "@/constants/localStorageConst";
import { useFocusEffect } from '@react-navigation/native';
import {PhysicalActivityKey} from "@/constants/physicalActivities";
import {Achievement} from "@/interfaces/achievement";
import {Achievements} from "@/constants/achievements";
import AchievementElement from "@/components/achievements/AchievementElement";
import AsyncStorage from "@react-native-async-storage/async-storage";


export default function TabFiveScreen() {
  const [activityJournal, setActivityJournal] = useState<ActivityJournal>({journal:[]})
  const [loading, setLoading] = useState(true)
  const [usersAchievement, setUserAchievement] = useState<Achievement[]>([])
  const achievements = Achievements;

  const fetchJournal = async () => {
    try {
      const journalString = await getItemFor(LocalStorageKeys.USER_ACTIVITIES_JOURNAL);
      if (journalString) {
        setActivityJournal(JSON.parse(journalString));
      } else {
        setActivityJournal({ journal: [] });
      }
    } catch (error) {
      console.error("Error fetching journal data:", error);
    } finally {
      setLoading(false);
    }
  };


  const aggregateAchievements = () => {
    const aggregatedData: Record<PhysicalActivityKey, number> = {
      RUNNING: 0,
      SWIMMING: 0,
      CYCLING: 0,
      CLIMBING: 0,
    };
    activityJournal.journal.forEach(day => {
      day.items.forEach(item => {
        aggregatedData[item.type] += item.amount;
      });
    });
    // console.log(aggregatedData)

    // Check achievements
    achievements.forEach(achievement => {
      if(achievement.activityType) {
        const userValue = aggregatedData[achievement.activityType];
        if (userValue >= achievement.target) {
          achievement.completed = true;
        }
      }
    });

    const sortedAchievements = achievements.sort((a, b) => {
      if (a.completed && !b.completed) return -1;
      if (!a.completed && b.completed) return 1;
      return 0;
    });

    setUserAchievement(sortedAchievements);
  }

  const copyToClipboard = async () => {
    const allExistingKeys = await AsyncStorage.getAllKeys()
    console.log(allExistingKeys)
    const allValues = await AsyncStorage.multiGet(allExistingKeys)
    console.log(allValues)
    Clipboard.setString(allValues.toString())
  }

  useFocusEffect(
    useCallback(() => {
      fetchJournal()
      return () => {
        setLoading(true)
      };
    }, [])
  );

  useEffect(() => {
    if(!loading)
      aggregateAchievements()
  }, [loading]);


  return (
    <Scrollable>
      <View style={{alignItems: 'center', marginTop: 15}}>
      </View>
      {usersAchievement.map((item, index) => (
        <AchievementElement
          key={index}
          item={item}
        />)
      )}
      <Pressable
        style={({pressed}) => [
          {
            backgroundColor: pressed ? 'white' : '#4656cd',
          },
          styles.button
        ]}
        onPress={copyToClipboard}
      >
        <ThemedText> Kopiuj </ThemedText>
      </Pressable>
    </Scrollable>
  );
}

const styles = StyleSheet.create({
    button: {
      marginTop: 10,
      borderRadius: 20,
      padding: 10,
      elevation: 2,
      width: '100%',
      alignItems: 'center',
    },
    buttonClose: {
      backgroundColor: '#4656cd',
    },
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 50,
    },
    modalView: {
      // margin: 20,
      backgroundColor: 'rgba(255,255,255,0.95)',
      borderRadius: 20,
      paddingHorizontal: 20,
      paddingVertical: 20,
      minHeight: 260,
      height: '45%',
      width: '85%',
      alignItems: 'center',
      shadowColor: '#1e1f22',
      shadowOffset: {
        width: 4,
        height: 10,
      },
      shadowOpacity: 0.25,
      shadowRadius: 10,
      elevation: 5,
    },
    pickerWrapper:{
      marginTop: 10,
      backgroundColor: "white",
      borderStyle: "solid",
      borderWidth: 1,
      borderColor: 'grey',
      borderRadius: 5,
    },
  }
)
