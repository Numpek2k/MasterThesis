import {View, StyleSheet, Text, Modal, Alert, Pressable} from "react-native";
import {PropsWithChildren, useState} from "react";
import {ThemedText} from "@/components/ThemedText";
import {Switch, TextInput} from "react-native-paper";
import {Scrollable} from "@/components/Scrollable";
import {useFonts} from "expo-font";
import * as LocalStorageKeys from '../constants/localStorageConst';
import {getItemFor, storeData} from "@/helpers/storageHepler";
import RNPickerSelect from 'react-native-picker-select';
import CollapsibleView from "@/components/CollapsibleView";


export default function firstTimeUseSettings({children} :PropsWithChildren){

  const [loaded] = useFonts({
    MinecraftRegular: require('../assets/fonts/F77MinecraftRegular.ttf'),
  });

  const [modalVisible, setModalVisible] = useState(true)
  const [dailyStepTarget, setDailyStepTarget] = useState("")
  const [username, setUsername] = useState("")
  const [userGender, setUserGender] = useState(true)
  const [userAge, setUserAge] = useState("")
  const [userHeight, setUserHeight] = useState("")
  const [userWeight, setUserWeight] = useState("")
  const [userDailyActivities, setUserDailyActivities] = useState("")

  const checkEveryInput = (): boolean => {
    if(!dailyStepTarget) {
      console.log("Daily steps empty")
      return false
    }
    if(!username) {
      console.log("username empty")
      return false
    }
    if(!userAge) {
      console.log("userAge empty")
      return false
    }
    if(!userHeight) {
      console.log("userHeight empty")
      return false
    }
    if(!userWeight) {
      console.log("userWeight empty")
      return false
    }
    if(!userDailyActivities) {
      console.log("userDailyActivities empty")
      return false
    }
    return true;
  }

  const saveUserDataToLocalStorage = async() => {
    await storeData(LocalStorageKeys.USER_DATA_AGE, userAge)
    await storeData(LocalStorageKeys.USER_DATA_DAILY_STEP_TARGET, dailyStepTarget)
    await storeData(LocalStorageKeys.USER_DATA_USERNAME, username)
    await storeData(LocalStorageKeys.USER_DATA_HEIGHT, userHeight)
    await storeData(LocalStorageKeys.USER_DATA_WEIGHT, userWeight)
    await storeData(LocalStorageKeys.USER_DATA_DAILY_ACTIVITIES, userDailyActivities)

    if(userGender)
      await storeData(LocalStorageKeys.USER_DATA_GENDER, "M")
    else
      await storeData(LocalStorageKeys.USER_DATA_GENDER, "K")

  }

  const printUserLocalData = async() => {
    console.log(await getItemFor(LocalStorageKeys.USER_DATA_AGE))
    console.log(await getItemFor(LocalStorageKeys.USER_DATA_DAILY_STEP_TARGET))
    console.log(await getItemFor(LocalStorageKeys.USER_DATA_USERNAME))
    console.log(await getItemFor(LocalStorageKeys.USER_DATA_HEIGHT))
    console.log(await getItemFor(LocalStorageKeys.USER_DATA_WEIGHT))
    console.log(await getItemFor(LocalStorageKeys.USER_DATA_DAILY_ACTIVITIES))
    console.log(await getItemFor(LocalStorageKeys.USER_DATA_GENDER))
  }

  const calculateCaloriesIntake = async() => {
    const gender = await getItemFor(LocalStorageKeys.USER_DATA_GENDER)
    let BMR = 0
    let TMR = 0
    if(gender == 'M'){
      BMR = 10 * +userWeight + 6.25 * +userHeight - 5 * +userAge + 5
    }
    else if(gender == 'K'){
      BMR = 10 * +userWeight + 6.25 * +userHeight - 5 * +userAge - 161
    }

    switch (+userDailyActivities){
      case 0:
        TMR = BMR * 1.5
        break;
      case 1:
        TMR = BMR * 1.7
        break;
      case 2:
        TMR = BMR * 1.9
        break;
      case 3:
        TMR = BMR * 2.1
        break;
    }

    let dailyCarbs = Math.round(TMR * 0.62 / 4);
    let dailyFiber = Math.round(TMR * 0.18 / 4);
    let dailyFats = Math.round(TMR * 0.20 / 7);

    await storeData(LocalStorageKeys.USER_DATA_CALORIES_TMR, TMR.toString())
    await storeData(LocalStorageKeys.USER_DATA_CALORIES_BMR, BMR.toString())
    await storeData(LocalStorageKeys.USER_DAILY_CARBS_GRAMS, dailyCarbs.toString())
    await storeData(LocalStorageKeys.USER_DAILY_FAT_GRAMS, dailyFats.toString())
    await storeData(LocalStorageKeys.USER_DAILY_PROTEINS_GRAMS, dailyFiber.toString())

    console.log("TMR",TMR)
    console.log("BMR",BMR)

  }


  return(
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        Alert.alert('Modal has been closed.');
        setModalVisible(!modalVisible);
      }}>
      <View style={[styles.centeredView]}>
        <View style={styles.modalView}>
          <Scrollable headerBackgroundColor = {true} noPadding={true}>
            <ThemedText type="title" style={{color: 'black'}}>Ustawienia</ThemedText>

            <TextInput
              contentStyle={{fontFamily: 'MinecraftRegular'}}
              style={styles.textInput}
              mode = 'outlined'
              label={"Nazwa użytkownika"}
              onChangeText={(text) => setUsername(text)}
              value={username}
              activeOutlineColor={'#002c8a'}
            />

            <TextInput
              contentStyle={{fontFamily: 'MinecraftRegular'}}
              style={styles.textInput}
              mode = 'outlined'
              label={"Cel kroków"}
              onChangeText={(text) => setDailyStepTarget(text)}
              value={dailyStepTarget}
              inputMode={"numeric"}
              keyboardType={"numeric"}
              activeOutlineColor={'#002c8a'}
            />

            <View  style={styles.switchContainer}>
              <ThemedText type="subtitle" style={{color: 'black'}}>Płeć:</ThemedText>
              <View style={styles.switchRow}>
                <ThemedText type="subtitle" style={{color: 'black'}}>K</ThemedText>
                <Switch value={userGender} onValueChange={() => {
                  setUserGender(!userGender)
                }} />
                <ThemedText type="subtitle" style={{color: 'black'}}>M</ThemedText>
              </View>
            </View>

            <TextInput
              contentStyle={{fontFamily: 'MinecraftRegular'}}
              style={styles.textInput}
              mode = 'outlined'
              label={"Wiek"}
              onChangeText={(text) => setUserAge(text)}
              value={userAge}
              inputMode={"numeric"}
              keyboardType={"numeric"}
              activeOutlineColor={'#002c8a'}
            />

            <TextInput
              contentStyle={{fontFamily: 'MinecraftRegular'}}
              style={styles.textInput}
              mode = 'outlined'
              label={"Wzrost (w CM)"}
              onChangeText={(text) => setUserHeight(text)}
              value={userHeight}
              inputMode={"numeric"}
              keyboardType={"numeric"}
              activeOutlineColor={'#002c8a'}
            />


            <TextInput
              contentStyle={{fontFamily: 'MinecraftRegular'}}
              style={styles.textInput}
              mode = 'outlined'
              label={"Waga"}
              onChangeText={(text) => setUserWeight(text)}
              value={userWeight}
              inputMode={"numeric"}
              keyboardType={"numeric"}
              activeOutlineColor={'#002c8a'}
            />


            <View style={styles.pickerWrapper}>
              <RNPickerSelect
                onValueChange={(value) => setUserDailyActivities(value)}
                placeholder={{label: "Aktywność"}}
                items={[
                  { label: 'Siedzący tryb życia', value: '0' },
                  { label: 'Lekko aktywny', value: '1' },
                  { label: 'Umiarkowanie aktywny', value: '2' },
                  { label: 'Bardzo aktywny', value: '3' },
                ]}
              />
            </View>

            <View style={{marginTop:15}}>
              <CollapsibleView title={"Opis poziomu aktywności "}>
                <ThemedText style={{color:'black', marginTop:10}}>
                  Siedzący tryb życia:
                  Minimalna aktywność fizyczna. Brak regularnych ćwiczeń.
                </ThemedText>
                <ThemedText style={{color:'black', marginTop:10}}>
                  Lekko aktywny:
                  Trochę ruchu w pracy. Regularne lekkie ćwiczenia kilka razy w tygodniu.
                </ThemedText>
                <ThemedText style={{color:'black', marginTop:10}}>
                  Umiarkowanie aktywny:
                  Codzienna praca wymagająca wysiłku fizycznego lub umiarkowane ćwiczenia.
                </ThemedText>
                <ThemedText style={{color:'black', marginTop:10}}>
                  Bardzo aktywny:
                  Ciężka praca lub energiczne ćwiczenia trwające kilka godzin dziennie.
                </ThemedText>
              </CollapsibleView>
            </View>

            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => {
                // setModalVisible(!modalVisible)
                if(checkEveryInput()) {
                  saveUserDataToLocalStorage().then(() => {
                    printUserLocalData()
                    calculateCaloriesIntake()
                    setModalVisible(!modalVisible)
                  })
                }
                else {
                  printUserLocalData()
                  Alert.alert('Uzupełnij wszystkie dane :)');
                }
              }
              }>

              <Text style={styles.textStyle}>Zapisz</Text>
            </Pressable>
          </Scrollable>

        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
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
    height: '90%',
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
  button: {
    marginTop: 10,
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: '#323f93',
  },
  textStyle: {
    color: 'white',
    textAlign: 'center',
    fontFamily: 'MinecraftRegular',
    fontSize: 20
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  textInput:{
    marginTop: 10,
  },
  switchContainer:{
    marginTop: 10,
    justifyContent: "center",
    alignItems: 'center',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pickerWrapper:{
    marginTop: 10,
    backgroundColor: "white",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 5,
  },
  inputAndroid: {
    fontSize: 18,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'gray',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
    fontFamily: 'MinecraftRegular', // Set your desired font family here
  },
});
