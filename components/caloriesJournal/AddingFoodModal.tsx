import {TextInput} from "react-native-paper";
import {ThemedText} from "@/components/ThemedText";
import {CALORIES_NINJA_API_KEY} from "@/constants/apiKeys";
import FastTranslator from "fast-mlkit-translate-text";
import {NutritionInfo, NutritionItem, NutritionSimpleItem, nutritionTestData} from "@/interfaces/nutritionInfo";
import {useEffect, useRef, useState} from "react";
import {Modal, Pressable, StyleSheet, View} from "react-native";
import {Scrollable} from "@/components/Scrollable";
import NutritionElement from "@/components/caloriesJournal/NutritionElement";
import {NutritionJournal} from "@/interfaces/nutritionJournal";
import {getItemFor, storeData} from "@/helpers/storageHepler";
import * as LocalStorageKeys from "@/constants/localStorageConst";

export default function AddingFoodModal () {
  const [modalVisible, setModalVisible] = useState(false)
  const [searchInput, setSearchInput] = useState("")
  const [nutritionInfo, setNutritionInfo] = useState<NutritionInfo | null>(null);
  const [nutritionJournal, setNutritionJournal] = useState<NutritionJournal>({ journal: [] });

  const typingTimeout = useRef<NodeJS.Timeout | null>(null);
  const [lastTypingTime, setLastTypingTime] = useState(Date.now());


  const fetchNutritionInfo = async (query: string) => {
    try {
      const response = await fetch(`https://api.calorieninjas.com/v1/nutrition?query=${query}`, {
        headers: {
          'X-Api-Key': CALORIES_NINJA_API_KEY
        }
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data: NutritionInfo = await response.json();
      await FastTranslator.prepare({
        source: 'English',
        target: 'Polish',
        downloadIfNeeded: true})
        // .then(() => console.log("Language data downloaded"));

      const translatedItems = await Promise.all(data.items.map(async (item: NutritionItem) => {
        const translatedName = await FastTranslator.translate(item.name);
        return { ...item, name: translatedName };
      }));
      setNutritionInfo({ items: translatedItems });
      // console.log({ items: translatedItems });
    } catch (error) {
      console.error('Request failed:', error);
    }
  }

  const mockFetchNutritionInfo = async () => {
    try {
      const data: NutritionInfo = nutritionTestData
      await FastTranslator.prepare({
        source: 'English',
        target: 'Polish',
        downloadIfNeeded: true})
        .then(() => console.log("Language data downloaded"));

      const translatedItems = await Promise.all(data.items.map(async (item: NutritionItem) => {
        const translatedName = await FastTranslator.translate(item.name);
        return { ...item, name: translatedName };
      }));
      setNutritionInfo({ items: translatedItems });
      console.log({ items: translatedItems });
    } catch (error) {
      console.error('Request failed:', error);
    }
  }

  const translateInput = async (text: string)=> {
    await FastTranslator.prepare({
      source: 'Polish',
      target: 'English',
      downloadIfNeeded: true})
      // .then(() => console.log("Language data downloaded"));
    const translated = await FastTranslator.translate(text);

    return translated
  }

  const handleInputChange = (text: string) => {
    setSearchInput(text);
    setLastTypingTime(Date.now());
  };

  const handleInputEnd = async () => {
    // console.log('User stopped typing:', searchInput);
    if(searchInput) {
      const translated = await translateInput(searchInput);
      await fetchNutritionInfo(translated);
      // mockFetchNutritionInfo()
    }
    else{
      setNutritionInfo(null);
    }
  };

  const handleServingSizeChange = (name: string, newSize: number) => {
    if (nutritionInfo) {
      const updatedItems = nutritionInfo.items.map(item => {
        if (item.name === name && newSize > 0) {
          const ratio = newSize / item.serving_size_g;
          // console.log("Nutrition ratio", ratio, newSize, item.serving_size_g)
          return {
            ...item,
            serving_size_g: newSize,
            calories: parseFloat((item.calories * ratio).toFixed(2)),
            carbohydrates_total_g: parseFloat((item.carbohydrates_total_g * ratio).toFixed(2)),
            fat_total_g: parseFloat((item.fat_total_g * ratio).toFixed(2)),
            protein_g: parseFloat((item.protein_g * ratio).toFixed(2)),
          };
        }
        else {
          if (item.name === name) {
            return {
              ...item,
              serving_size_g: +newSize,
            };
          }
          return item;
        }
      });

      setNutritionInfo({ items: updatedItems });
      // console.log(nutritionInfo)
    }
  };

  const addItemToJournal = async (item: NutritionSimpleItem) => {
    const today = new Date().toISOString().split('T')[0];
    let updatedJournal: NutritionJournal;
    const existingDay = nutritionJournal.journal.find(day => day.date === today);
    if (existingDay) {
      existingDay.items.push(item);
      updatedJournal = {
        journal: nutritionJournal.journal.map(day =>
          day.date === today ? existingDay : day
        )
      };
    } else {
      updatedJournal = {
        journal: [...nutritionJournal.journal, { date: today, items: [item] }]
      };
    }
    console.log("im here", item)
    setNutritionJournal(updatedJournal);
    await storeData(LocalStorageKeys.USER_CALORIES_JOURNAL, JSON.stringify(updatedJournal));
  };

  // useEffect(() => {
  //   if (typingTimeout.current) {
  //     clearTimeout(typingTimeout.current);
  //   }
  //
  //   typingTimeout.current = setTimeout(() => {
  //     if (Date.now() - lastTypingTime >= 300) {
  //       handleInputEnd();
  //     }
  //   }, 300);
  //
  //   return () => {
  //     if (typingTimeout.current) {
  //       clearTimeout(typingTimeout.current);
  //     }
  //   };
  // }, [searchInput]);

  useEffect(() => {
    const fetchJournal = async () => {
      const journalString = await getItemFor(LocalStorageKeys.USER_CALORIES_JOURNAL);
      if (journalString) {
        setNutritionJournal(JSON.parse(journalString));
      }
    };

    fetchJournal();
  }, []);

  return(
    <View>
      <View style={{alignItems:'center'}}>
        <Pressable
          style={[styles.button, styles.buttonClose]}
          onPress={() => setModalVisible(true)}>
          <ThemedText style={{textAlign: 'center'}}>Znajdź składnik/posiłek</ThemedText>
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
                <TextInput
                  contentStyle={{fontFamily: 'MinecraftRegular'}}
                  style={{marginTop: 10}}
                  mode = 'outlined'
                  label={"Znajdź składnik/posiłek"}
                  onChangeText={(text) => setSearchInput(text)}
                  onSubmitEditing={handleInputEnd}
                  value={searchInput}
                  activeOutlineColor={'#002c8a'}
                />
              </View>
              {nutritionInfo && (
                <View>
                  {nutritionInfo.items.map((item, index) => (
                    <NutritionElement
                      name={item.name}
                      calories={item.calories}
                      fat_total_g={item.fat_total_g}
                      carbohydrates_total_g={item.carbohydrates_total_g}
                      serving_size_g={item.serving_size_g}
                      protein_g={item.protein_g}
                      key={index}
                      onServingSizeChange={handleServingSizeChange}
                      onAddToJournal={() => addItemToJournal(item)}
                    >
                    </NutritionElement>

                  ))}
                </View>
              )}
            </Scrollable>
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
  }
)