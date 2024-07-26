import {Modal, Pressable, StyleSheet, View} from "react-native";
import {ThemedText} from "@/components/ThemedText";
import {Scrollable} from "@/components/Scrollable";
import {TextInput} from "react-native-paper";
import {useEffect, useState} from "react";
import {ActivityLabels, PhysicalActivities, PhysicalActivityKey} from "@/constants/physicalActivities"
import RNPickerSelect from "react-native-picker-select";
import {getItemFor, storeData} from "@/helpers/storageHepler";
import * as LocalStorageKeys from "@/constants/localStorageConst";
import {ActivityItem, ActivityJournal, UpdateJournalFunction} from "@/interfaces/activityJournal";
import uuid from 'react-native-uuid';

interface AddingActivityModalProps {
  activityJournal: ActivityJournal;
  updateJournal: UpdateJournalFunction;
}

export default function AddingActivityModal({ activityJournal, updateJournal }: AddingActivityModalProps){
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedActivity, setSelectedActivity] = useState<PhysicalActivityKey>("RUNNING");
  const [activityAmount, setActivityAmount] = useState("0");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const selectedActivityDetails = PhysicalActivities[selectedActivity];

  const addItemToJournal = async () => {
    if (!activityAmount || isNaN(Number(activityAmount)) || Number(activityAmount) <= 0) {
      setErrorMessage("Podaj wartość");
      return;
    }
    setErrorMessage("");

    const today = new Date().toISOString().split('T')[0];
    const updatedJournal = { ...activityJournal };

    const item: ActivityItem = {
      id: uuid.v4().toString(),
      type: selectedActivity,
      amount: parseInt(activityAmount),
      points: 69
    };

    const existingDay = updatedJournal.journal.find(day => day.date === today);
    if (existingDay) {
      existingDay.items.push(item);
    } else {
      updatedJournal.journal.push({ date: today, dailySteps: 0, items: [item] });
    }

    updateJournal(updatedJournal);
    setModalVisible(false);  // Close the modal after adding the item
  };


  return(
    <View>
      <View style={{alignItems:'center'}}>
        <Pressable
          style={[styles.button, styles.buttonClose]}
          onPress={() => setModalVisible(true)}>
          <ThemedText style={{textAlign: 'center'}}>Dodaj aktywność</ThemedText>
        </Pressable>
      </View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={[styles.centeredView]}>
          <View style={styles.modalView}>
            <Scrollable headerBackgroundColor = {true} noPadding={true}>
              <ThemedText type="title" style={{color: 'black'}}>Dodaj</ThemedText>
              <View>
                <View style={styles.pickerWrapper}>
                  <RNPickerSelect
                    onValueChange={(value) => setSelectedActivity(value)}
                    placeholder={{label: "Aktywność"}}
                    items={Object.keys(PhysicalActivities).map((key) => ({
                      label: PhysicalActivities[key as PhysicalActivityKey].label,
                      value: key,
                      key,
                    }))}
                    value={selectedActivity}
                  />
                </View>
                <TextInput
                  contentStyle={{fontFamily: 'MinecraftRegular'}}
                  style={{marginTop: 10}}
                  mode = 'outlined'
                  label={ActivityLabels[selectedActivity]}
                  inputMode={"numeric"}
                  keyboardType={"numeric"}
                  onChangeText={(text) => setActivityAmount(text)}
                  value={activityAmount}
                  activeOutlineColor={'#002c8a'}
                />
              </View>
              {errorMessage ? (
                <ThemedText style={{ color: 'red', textAlign: 'center' }}>{errorMessage}</ThemedText>
              ) : null}
            </Scrollable>
            <Pressable
              style={({pressed}) => [
                {
                  backgroundColor: pressed ? 'white' : '#323f93',
                },
                styles.button
              ]}
              onPress={() => {
                addItemToJournal()
              }}
            >
              <ThemedText style={{textAlign: 'center', marginHorizontal: 10}}>Dodaj</ThemedText>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>

  )
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
      backgroundColor: '#323f93',
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
      height: '40%',
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