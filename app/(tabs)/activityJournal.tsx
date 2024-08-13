// TabTwoScreen.tsx
import { StyleSheet } from 'react-native';
import { Scrollable } from "@/components/Scrollable";
import AddingActivityModal from "@/components/activityJournal/AddingActivityModal";
import ActivityJournalComponent from "@/components/activityJournal/ActivityJournalComponent";
import {useCallback, useEffect, useState} from 'react';
import { getItemFor, storeData } from "@/helpers/storageHepler";
import * as LocalStorageKeys from "@/constants/localStorageConst";
import { ActivityJournal, UpdateJournalFunction } from "@/interfaces/activityJournal";
import {useFocusEffect} from "@react-navigation/native";
import {UsageJournal} from "@/interfaces/usageJournal"; // Adjust the import path as needed

export default function TabTwoScreen() {
  const [activityJournal, setActivityJournal] = useState<ActivityJournal>({ journal: [] });
  const [loading, setLoading] = useState(true);

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

  useFocusEffect(
    useCallback(() => {
      fetchJournal();
      return () => {
        setLoading(true)
      };
    }, [])
  );

  const updateJournal: UpdateJournalFunction = async (updatedJournal: ActivityJournal) => {
    setActivityJournal(updatedJournal);
    await storeData(LocalStorageKeys.USER_ACTIVITIES_JOURNAL, JSON.stringify(updatedJournal));
  };

  return (
    <Scrollable>
      <AddingActivityModal
        activityJournal={activityJournal}
        updateJournal={updateJournal}
      />
      <ActivityJournalComponent
        activityJournal={activityJournal}
        updateJournal={updateJournal}
        loading={loading}
      />
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
  reactLogo: {
    height: '100%',
    width: null,
    aspectRatio: 7000 / 2333, // Maintain the aspect ratio of the image
  }
});
