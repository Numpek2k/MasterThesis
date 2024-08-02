import {StyleSheet, View} from 'react-native';
import {ThemedText} from '@/components/ThemedText';
import {Scrollable} from "@/components/Scrollable";
import {WeeklyRankBoard} from "@/constants/weeklyRankConst";
import RankElement from "@/components/weeklyRank/RankElement";
import {useCallback, useEffect, useState} from "react";
import {ActivityJournal} from "@/interfaces/activityJournal";
import {getItemFor} from "@/helpers/storageHepler";
import * as LocalStorageKeys from "@/constants/localStorageConst";
import { useFocusEffect } from '@react-navigation/native';

export default function TabFourScreen() {
  const [sumPoints, setSumPoints] = useState(0)
  const [activityJournal, setActivityJournal] = useState<ActivityJournal>({journal: []})
  const [loading, setLoading] = useState(true)
  const board = WeeklyRankBoard


  const fetchJournal = async () => {
    try {
      const journalString = await getItemFor(LocalStorageKeys.USER_ACTIVITIES_JOURNAL);
      if (journalString) {
        setActivityJournal(JSON.parse(journalString));
      } else {
        setActivityJournal({journal: []});
      }
    } catch (error) {
      console.error("Error fetching journal data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPointsAndStepsLast7Days = () => {
    const last7Days = getLast7Days();
    let totalPoints = 0;
    let totalSteps = 0;

    activityJournal.journal.forEach(day => {
      if (last7Days.includes(day.date)) {
        totalSteps += day.dailySteps;
        day.items.forEach(item => {
          totalPoints += item.points;
        });
      }
    });
    setSumPoints(totalPoints + totalSteps)
  };

  const getLast7Days = (): string[] => {
    const dates = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(new Date().setTime(new Date().getTime() + 1000 * 60 * 60 * 2));
      date.setDate(date.getDate() - i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  useFocusEffect(
    useCallback(() => {
      fetchJournal();

      return () => {
        setLoading(true)
      };
    }, [])
  );

  useEffect(() => {
    if(loading)
      fetchPointsAndStepsLast7Days()
  }, [loading]);


  return (
    <Scrollable>
      <View style={{alignItems: 'center', marginTop: 15}}>
        <ThemedText style={{}} type={'subtitle'}>Tygodniowa ranga</ThemedText>
        <ThemedText style={{marginTop:10}} type={'subtitle'}>Twoje punkty:</ThemedText>
        <ThemedText style={{marginTop:10}} type={'subtitle'}>{sumPoints}</ThemedText>
      </View>

      {board.map((item, index) => (
        <RankElement
          key={index}
          item={item}
          sumPoints={sumPoints}
        />)
      )}
    </Scrollable>

  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  reactLogo: {
    height: '100%',
    width: null,
    aspectRatio: 7000 / 2333, // Maintain the aspect ratio of the image
  }
});
