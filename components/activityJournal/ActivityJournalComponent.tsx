import {Pressable, StyleSheet, useColorScheme, View} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import {Colors} from "@/constants/Colors";
import {ThemedText} from "@/components/ThemedText";
import {useEffect, useState} from "react";
import {ActivityJournal, UpdateJournalFunction} from "@/interfaces/activityJournal";
import ActivityElement from "@/components/activityJournal/ActivityElement";
import ProgressBar from "@/components/ProgressBar";
import {getItemFor} from "@/helpers/storageHepler";
import * as LocalStorageKeys from "@/constants/localStorageConst"

interface ActivityJournalComponentProps {
  activityJournal: ActivityJournal;
  updateJournal: UpdateJournalFunction;
  loading: boolean;
}

export default function ActivityJournalComponent({
     activityJournal,
     updateJournal,
     loading
   }: ActivityJournalComponentProps) {
  const [currentDateIndex, setCurrentDateIndex] = useState(0);
  const [reachedLeft, setReachedLeft] = useState(true);
  const [reachedRight, setReachedRight] = useState(true);
  const [stepDailyTarget, setStepDailyTarget] = useState(0);
  const theme = useColorScheme() ?? 'light';
  const todayDate = new Date().toISOString().split('T')[0];
  let currentDay = activityJournal.journal[currentDateIndex];

  const deleteElementJournal = async (itemId: string) => {
    let updatedJournal: ActivityJournal;
    const existingDay = activityJournal.journal.find(day => day.date === todayDate);

    if (existingDay) {
      existingDay.items = existingDay.items.filter(journalItem => journalItem.id !== itemId);
      if (existingDay.items.length > 0) {
        updatedJournal = {
          journal: activityJournal.journal.map(day =>
            day.date === todayDate ? existingDay : day
          )
        };
      } else {
        updatedJournal = {
          journal: activityJournal.journal.filter(day => day.date !== todayDate)
        };
      }
    } else {
      updatedJournal = { ...activityJournal };
    }

    updateJournal(updatedJournal);
  };

  const getMaxDailySteps = async () => {
    const max = await getItemFor(LocalStorageKeys.USER_DATA_DAILY_STEP_TARGET)
    if(max)
      setStepDailyTarget(parseInt(max))
  }

  const handlePreviousDate = () => {
    if (currentDateIndex > 0) {
      setCurrentDateIndex(currentDateIndex - 1);
    }
  };

  const handleNextDate = () => {
    if (currentDateIndex < activityJournal.journal.length - 1) {
      setCurrentDateIndex(currentDateIndex + 1);
    }
  };

  const calculateProgress = (sum: number, max: number) => {
    return max > 0 ? sum / max : 0;
  };

  useEffect(() => {
    if (!loading && activityJournal.journal.length > 0) {
      setCurrentDateIndex(activityJournal.journal.length - 1);
    }
  }, [loading, activityJournal.journal.length]);

  useEffect(() => {
    const journalLength = activityJournal.journal.length;
    setReachedLeft(currentDateIndex === 0);
    setReachedRight(currentDateIndex === journalLength - 1 || journalLength < 0);
  }, [currentDateIndex, activityJournal.journal.length]);

  useEffect(() => {
    getMaxDailySteps()
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ThemedText>Ładowanie...</ThemedText>
      </View>
    );
  }

  if (!currentDay) {
    return (
      <View style={styles.container}>
        <ThemedText>Brak aktywności :(</ThemedText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.dateSwitcher}>
        <Pressable onPress={handlePreviousDate} disabled={currentDateIndex === 0}>
          <Ionicons
            name={reachedLeft ? 'caret-back-circle-outline' : 'caret-back-circle'}
            size={32}
            color={theme === 'light' ? Colors.light.icon : Colors.dark.icon}
          />
        </Pressable>
        <ThemedText style={styles.dateText}>{currentDay.date}</ThemedText>
        <Pressable onPress={handleNextDate} disabled={currentDateIndex === activityJournal.journal.length - 1}>
          <Ionicons
            name={reachedRight ? 'caret-forward-circle-outline' : 'caret-forward-circle'}
            size={32}
            color={theme === 'light' ? Colors.light.icon : Colors.dark.icon}
          />
        </Pressable>
      </View>

      <ThemedText style={{ marginTop: 10 }}>Kroki: {activityJournal.journal[currentDateIndex].dailySteps}</ThemedText>
      <View style={{ flexDirection: 'row' }}>
        <ThemedText style={{ width: '20%', textAlign: 'center' }}>0</ThemedText>
        <ProgressBar
          progress={calculateProgress(activityJournal.journal[currentDateIndex].dailySteps,stepDailyTarget)}
          bgColor='#FFA500'
        />
        <ThemedText style={{ width: '20%', textAlign: 'center' }}>{stepDailyTarget}</ThemedText>
      </View>

      <View style={styles.journalElementContainer}>
        {currentDay.items.map((item, itemIndex) => (
          <ActivityElement
            key={itemIndex}
            item={item}
            onDeleteJournalElement={() => deleteElementJournal(item.id)}
            showDeleteButton={currentDay.date === todayDate}
          />
        ))}

      </View>


    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: 'center'
  },
  dateSwitcher: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '75%',
  },
  dateText: {
    fontSize: 16,
  },
  journalElementContainer: {
    width: '95%'
  }
});
