import {Image, StyleSheet, View} from "react-native";
import ProgressBar from "@/components/ProgressBar";
import {ThemedText} from "@/components/ThemedText";
import {useEffect, useState} from "react";
import {getItemFor} from "@/helpers/storageHepler";
import * as LocalStorageKeys from '@/constants/localStorageConst'

interface UserInfoProps {
  userSteps: number
}

export default function UserInformation({userSteps}: UserInfoProps) {
  const [userStepTarget, setUserStepTarget] = useState(0)
  const [username, setUsername] = useState('')
  const [userHealth, setUserHealth] = useState('')

  const calculateProgress = (sum: number, max: number) => {
    return max > 0 ? sum / max : 0;
  };

  const fetchInitialData = () => {
    getItemFor(LocalStorageKeys.USER_DATA_DAILY_STEP_TARGET).then((result) => {
      if (result)
        setUserStepTarget(parseInt(result))
    })
    getItemFor(LocalStorageKeys.USER_DATA_USERNAME).then((result) => {
      if (result)
        setUsername(result)
    })
    getItemFor(LocalStorageKeys.USER_HEALTH).then((result) => {
      if (result)
        setUserHealth(result)
    })
  }

  useEffect(() => {
    fetchInitialData()
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.itemsInRow}>
        <View style={styles.logo}>
          <Image
            style={{width: "100%", height: "100%", resizeMode: "contain"}}
            source={require('@/assets/images/1094752-200-2.png')}
            resizeMethod={"auto"}
          />
        </View>
        <View style={styles.statsContainer}>
          <ThemedText>{username}</ThemedText>
          <ThemedText>Zdrowie: {userHealth}</ThemedText>
          <View style={[styles.itemsInRow, styles.inputContainer]}>
            <ThemedText style={styles.activityText}>0</ThemedText>
            <ProgressBar
              progress={calculateProgress(parseInt(userHealth), 100)}
              bgColor={'#ae1010'}
            />
            <ThemedText
              style={styles.activityText}>100</ThemedText>
          </View>
        </View>
      </View>
      <View style={styles.container}>
        <ThemedText>Kroki: {userSteps}</ThemedText>
        <View style={[styles.itemsInRow, styles.inputContainer]}>
          <ThemedText style={styles.activityText}>0</ThemedText>
          <ProgressBar
            progress={calculateProgress(userSteps, userStepTarget)}
            bgColor={'#FFA500'}
          />
          <ThemedText
            style={styles.activityText}>{userStepTarget.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '\n')}
          </ThemedText>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
    padding: 10,
  },
  itemsInRow: {
    flexDirection: 'row',
  },
  statsContainer: {
    width: '70%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  inputContainer: {
    alignItems: 'center',
    justifyContent: 'center'
    // height:100
    // marginEnd: 18
  },
  button: {
    marginTop: 10,
    borderRadius: 20,
    padding: 10,
    alignItems: 'center',
    // backgroundColor: '#323f93',
  },
  activityDetail: {
    width: "50%",
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityText: {
    width:'20%',
    textAlign: 'center',
  },
  logo: {
    width: '30%',
    height: 100
  }
})