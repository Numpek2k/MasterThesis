import {
  aggregateRecord,
  getSdkStatus,
  initialize,
  requestPermission,
  SdkAvailabilityStatus
} from "react-native-health-connect";
import {useCallback, useEffect, useState} from "react";
import {ThemedText} from "@/components/ThemedText";
import {getItemFor, storeData} from "@/helpers/storageHepler";
import * as LocalStorageKeys from "@/constants/localStorageConst"
import {ActivityJournal} from "@/interfaces/activityJournal";
import {convertCodeUnitToBytes} from "@zxing/text-encoding/es2015/coders/utf-16/converCodeUnitToBytes";
import {useFocusEffect} from "@react-navigation/native";

const getTodayDate = (): Date => {
  return new Date();
};

export function HealthConnectStepCounter() {

  const [todaySteps, setTodaySteps] = useState<number>(0);
  const [activityJournal, setActivityJournal] = useState<ActivityJournal>({journal: []});
  const [loading, setLoading] = useState(true);

  const initializeHealthConnect = async () => {
    const result = await initialize();
  };

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


  const updateDailySteps = async () => {
    try {
      const lastUpdateDateString = await getItemFor(LocalStorageKeys.LAST_ACTIVITY_JOURNAL_UPDATE);
      const firstLaunchDateString = await getItemFor(LocalStorageKeys.FIRST_LAUNCHED_DATE);

      const lastUpdateDate = lastUpdateDateString ? new Date(lastUpdateDateString) : new Date(firstLaunchDateString || 0);
      const todayDate = new Date();

      const currentDate = getStartOfDay(lastUpdateDate);
      while (currentDate <= getStartOfDay(todayDate)) {
        const startTime = getStartOfDay(currentDate).toISOString();
        const endTime = getEndOfDay(currentDate).toISOString();

        const result = await aggregateRecord({
          recordType: 'Steps',
          timeRangeFilter: {
            operator: 'between',
            startTime: startTime,
            endTime: endTime,
          },
        });

        const stepsCount = result.COUNT_TOTAL;
        const dateString = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1, 0, 0, 0).toISOString().split('T')[0];
        const dayEntry = activityJournal.journal.find(day => day.date === dateString);
        if (dayEntry) {
          dayEntry.dailySteps = stepsCount;
        } else {
          activityJournal.journal.push({
            date: dateString,
            dailySteps: stepsCount,
            items: [],
          });
        }
        currentDate.setDate(currentDate.getDate() + 1)
      }

      // activityJournal.journal.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      // console.log(activityJournal)
      await storeData(LocalStorageKeys.USER_ACTIVITIES_JOURNAL, JSON.stringify(activityJournal));
      await storeData(LocalStorageKeys.LAST_ACTIVITY_JOURNAL_UPDATE, todayDate.toISOString());


    } catch (error) {
      console.error('Failed to update daily steps', error);
    } finally {

    }
  };

  const checkAvailability = async () => {
    const status = await getSdkStatus();
    if (status === SdkAvailabilityStatus.SDK_AVAILABLE) {
      console.log('SDK is available');
    }

    if (status === SdkAvailabilityStatus.SDK_UNAVAILABLE) {
      console.log('SDK is not available');
    }

    if (
      status === SdkAvailabilityStatus.SDK_UNAVAILABLE_PROVIDER_UPDATE_REQUIRED
    ) {
      console.log('SDK is not available, provider update required');
    }
  };

  const requestSamplePermissions = () => {
    requestPermission([
      {
        accessType: 'read',
        recordType: 'Steps',
      },
      {
        accessType: 'read',
        recordType: 'ExerciseSession',
      }
    ]).then((permissions) => {
      console.log('Granted permissions on request ', {permissions});
    });
  };

  const aggregateTodaySteps = async () => {
    const todayStart = getStartOfDay(getTodayDate()).toISOString();
    const todayEnd = getEndOfDay(getTodayDate()).toISOString();

    try {
      const result = await aggregateRecord({
        recordType: 'Steps',
        timeRangeFilter: {
          operator: 'between',
          startTime: todayStart,
          endTime: todayEnd,
        },
      });

      const stepsCount = result.COUNT_TOTAL;
      setTodaySteps(stepsCount);

      const todayDateString = getStartOfDay(new Date(getTodayDate().setDate(getTodayDate().getDate() + 1))).toISOString().split('T')[0];
      const todayEntry = activityJournal.journal.find(day => day.date === todayDateString);
      if (todayEntry) {
        todayEntry.dailySteps = stepsCount;
      } else {
        activityJournal.journal.push({
          date: todayDateString,
          dailySteps: stepsCount,
          items: [],
        });
      }

      // Sort the journal by date before storing it

      activityJournal.journal.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      await storeData(LocalStorageKeys.USER_ACTIVITIES_JOURNAL, JSON.stringify(activityJournal));
    } catch (error) {
      console.error('Failed to aggregate today\'s steps', error);
    }
  };


  const getStartOfDay = (date: Date): Date => {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
  };

  const getEndOfDay = (date: Date): Date => {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);
  };

  useFocusEffect(
    useCallback(() => {
      fetchJournal()

      return() => {
        setLoading(true)
      }
    }, [])
  )

  useEffect(() => {
    initializeHealthConnect()
    checkAvailability()

    // requestSamplePermissions()
    // updateDailySteps()
  }, []);

  useEffect(() => {
    if(!loading) {
      updateDailySteps().then(() => {
        aggregateTodaySteps()
        // const interval = setInterval(() => {
        //   aggregateTodaySteps()
        // }, 10 * 1000);
        // return () => clearInterval(interval);
        }
      )

    }
  }, [loading]);

  return (
    <ThemedText>
      Step Counter last 24 hours: {todaySteps}
    </ThemedText>

  );
}