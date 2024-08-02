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
import {useFocusEffect} from "@react-navigation/native";
import {Modal, Pressable, StyleSheet, View} from "react-native";
import {Scrollable} from "@/components/Scrollable";
import Ionicons from "@expo/vector-icons/Ionicons";

const getTodayDate = (): Date => {
  return new Date();
};

interface HealthConnectProp {
  onTodayStepsUpdate: (steps: number) => void;
  onStreakReset: () => void;
  onUpdate: () => void;
}


export function HealthConnectStepCounter({ onTodayStepsUpdate, onStreakReset,onUpdate}: HealthConnectProp) {

  const [todaySteps, setTodaySteps] = useState<number>(0);
  const [activityJournal, setActivityJournal] = useState<ActivityJournal>({journal: []});
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false)
  const [permission, setPermission] = useState(false)

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
      const userStepTarget = await getItemFor(LocalStorageKeys.USER_DATA_DAILY_STEP_TARGET);
      let userHealth = 0
      await getItemFor(LocalStorageKeys.USER_HEALTH).then((res) => {
        if(res)
          userHealth = parseInt(res)
      })

      let currentUserStreak = 0
      await getItemFor(LocalStorageKeys.USER_STREAK).then((res) => {
        if(res)
          currentUserStreak = parseInt(res)
        else
          currentUserStreak = 0
      })

      const lastUpdateDate = lastUpdateDateString ? new Date(lastUpdateDateString) : new Date(firstLaunchDateString || 0);
      const todayDate = new Date();

      const currentDate = getStartOfDay(lastUpdateDate);
      while (currentDate < getStartOfDay(todayDate)) {
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
        let dailyPoints = 0;
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
        activityJournal.journal.find(day => day.date === dateString)?.items.forEach(item => {
          dailyPoints += item.points;
        })
        if(userStepTarget && (dailyPoints+stepsCount) >= parseInt(userStepTarget))
          currentUserStreak += 1
        else {
          currentUserStreak = 0
          userHealth -= 20
        }
        // console.log(currentDate,currentUserStreak,dailyPoints,stepsCount)
        currentDate.setDate(currentDate.getDate() + 1)
      }

      // activityJournal.journal.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      // console.log(JSON.stringify(activityJournal))
      await storeData(LocalStorageKeys.USER_ACTIVITIES_JOURNAL, JSON.stringify(activityJournal));
      await storeData(LocalStorageKeys.LAST_ACTIVITY_JOURNAL_UPDATE, todayDate.toISOString());
      await storeData(LocalStorageKeys.USER_STREAK,currentUserStreak.toString());
      await storeData(LocalStorageKeys.USER_HEALTH,userHealth.toString());

      if(userHealth < 0)
        setModalVisible(true)

      onUpdate()
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
      // {
      //   accessType: 'read',
      //   recordType: 'ExerciseSession',
      // }
    ]).then((permissions) => {
      console.log('Granted permissions on request ', {permissions});
    }).catch((err) => console.log('Permission error', err));
  };

  const aggregateTodaySteps = async () => {
    const todayStart = getStartOfDay(getTodayDate()).toISOString();
    const todayEnd = getEndOfDay(getTodayDate()).toISOString();
    // console.log(todayStart,todayEnd)
    try {
      const result = await aggregateRecord({
        recordType: 'Steps',
        timeRangeFilter: {
          operator: 'between',
          startTime: todayStart,
          endTime: todayEnd,
        },
      })

      const stepsCount = result.COUNT_TOTAL;
      setTodaySteps(stepsCount);
      console.log(todayStart, todayEnd)
      console.log('here', result)
      onTodayStepsUpdate(stepsCount);

      const todayDateString = getStartOfDay(new Date(getTodayDate().setDate(getTodayDate().getDate() + 1))).toISOString().split('T')[0];
      const todayEntry = activityJournal.journal.find(day => day.date === todayDateString);
      console.log(todayDateString)
      // console.log(JSON.stringify(todayEntry))
      if (todayEntry) {
        todayEntry.dailySteps = stepsCount;
        console.log(todayEntry)
      } else {
        activityJournal.journal.push({
          date: todayDateString,
          dailySteps: stepsCount,
          items: [],
        });
      }

      // Sort the journal by date before storing it

      // activityJournal.journal.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      await storeData(LocalStorageKeys.USER_ACTIVITIES_JOURNAL, JSON.stringify(activityJournal));
    } catch (error) {
      console.error('Failed to aggregateTodaySteps today\'s steps', error);
    }
  };

  const resetCharacter = () => {
    storeData(LocalStorageKeys.USER_HEALTH,'100')
    storeData(LocalStorageKeys.USER_STREAK, '0')
    onStreakReset()
  }

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
    // requestSamplePermissions()
    checkAvailability()

    updateDailySteps()
  }, []);
  //
  // useEffect(() => {
  //   if(permission)
  //     updateDailySteps()
  // }, [permission]);

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
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      >
      <View style={[styles.centeredView]}>
        <View style={styles.modalView}>
          <Scrollable headerBackgroundColor = {true} noPadding={true}>
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
              <ThemedText type="title" style={{color: 'black'}}>Zombie cię dopadło</ThemedText>
              <Ionicons name={'skull'} size={128}/>
            </View>
          </Scrollable>
          <Pressable
            style={({pressed}) => [
              {
                backgroundColor: pressed ? 'white' : '#4656cd',
              },
              styles.button
            ]}
            onPress={() => {
              resetCharacter()
              setModalVisible(!modalVisible)
            }}

          >
            <ThemedText style={{textAlign: 'center', marginHorizontal: 10}}>Reset</ThemedText>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}


const styles = StyleSheet.create({
    button: {
      marginTop: 10,
      borderRadius: 20,
      padding: 10,
      elevation: 2,
      width: '80%',
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