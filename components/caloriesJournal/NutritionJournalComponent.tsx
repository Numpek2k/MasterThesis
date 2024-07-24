import {useEffect, useState} from "react";
import {getItemFor, storeData} from "@/helpers/storageHepler";
import * as LocalStorageKeys from "@/constants/localStorageConst";
import {NutritionDay, NutritionJournal} from "@/interfaces/nutritionJournal";
import {Pressable, StyleSheet, useColorScheme, View} from "react-native";
import {ThemedText} from "@/components/ThemedText";
import {Colors} from "@/constants/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import JournalElement from "@/components/caloriesJournal/JournalElement";
import {NutritionSimpleItem} from "@/interfaces/nutritionInfo";
import ProgressBar from "@/components/ProgressBar";

export default function NutritionJournalComponent(){
  const [nutritionJournal, setNutritionJournal] = useState<NutritionJournal>({ journal: [] });
  const [currentDateIndex, setCurrentDateIndex] = useState(0);
  const [reachedLeft, setReachedLeft] = useState(true);
  const [reachedRight, setReachedRight] = useState(true);
  const [loading, setLoading] = useState(true);
  const [dailyCaloriesSum, setDailyCaloriesSum] = useState(0);
  const [dailyCarbsSum, setDailyCarbsSum] = useState(0);
  const [dailyFatSum, setDailyFatSum] = useState(0);
  const [dailyProteinsSum, setDailyProteinsSum] = useState(0);
  const [maxCalories, setMaxCalories] = useState(0);
  const [maxCarbs, setMaxCarbs] = useState(0);
  const [maxFat, setMaxFat] = useState(0);
  const [maxProteins, setMaxProteins] = useState(0);
  const theme = useColorScheme() ?? 'light';
  const todayDate = new Date().toISOString().split('T')[0];

  const fetchJournal = async () => {
    try {
      const journalString = await getItemFor(LocalStorageKeys.USER_CALORIES_JOURNAL);
      if (journalString) {
        setNutritionJournal(JSON.parse(journalString));
      } else {
        setNutritionJournal({ journal: [] });
      }
    } catch (error) {
      console.error("Error fetching journal data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDailyMaxValues = async () => {
    try {
      const maxCalories = await getItemFor(LocalStorageKeys.USER_DATA_CALORIES_TMR) || 0;
      const maxCarbs = await getItemFor(LocalStorageKeys.USER_DAILY_CARBS_GRAMS) || 0;
      const maxFat = await getItemFor(LocalStorageKeys.USER_DAILY_FAT_GRAMS) || 0;
      const maxProteins = await getItemFor(LocalStorageKeys.USER_DAILY_PROTEINS_GRAMS) || 0;

      setMaxCalories(Number(maxCalories));
      setMaxCarbs(Number(maxCarbs));
      setMaxFat(Number(maxFat));
      setMaxProteins(Number(maxProteins));
    } catch (error) {
      console.error("Error fetching daily max values:", error);
    }
  };

  const calculateDailyTotals = (day: NutritionDay) => {
    if (!day) return;

    const caloriesSum = parseFloat(day.items.reduce((sum, item) => sum + item.calories, 0).toFixed(1));
    const carbsSum = parseFloat(day.items.reduce((sum, item) => sum + item.carbohydrates_total_g, 0).toFixed(1));
    const fatSum = parseFloat(day.items.reduce((sum, item) => sum + item.fat_total_g, 0).toFixed(1));
    const fibersSum = parseFloat(day.items.reduce((sum, item) => sum + item.protein_g, 0).toFixed(1));

    setDailyCaloriesSum(caloriesSum);
    setDailyCarbsSum(carbsSum);
    setDailyFatSum(fatSum);
    setDailyProteinsSum(fibersSum);
  };

  const deleteElementJournal = async (item: NutritionSimpleItem) => {
    let updatedJournal: NutritionJournal;
    const existingDay = nutritionJournal.journal.find(day => day.date === todayDate);

    if (existingDay) {
      existingDay.items = existingDay.items.filter(journalItem => journalItem !== item);
      if (existingDay.items.length > 0) {
        updatedJournal = {
          journal: nutritionJournal.journal.map(day =>
            day.date === todayDate ? existingDay : day
          )
        };
      } else {
        updatedJournal = {
          journal: nutritionJournal.journal.filter(day => day.date !== todayDate)
        };
      }
    } else {
      updatedJournal = { ...nutritionJournal };
    }

    setNutritionJournal(updatedJournal);
    await storeData(LocalStorageKeys.USER_CALORIES_JOURNAL, JSON.stringify(updatedJournal));
  };

  useEffect(() => {
    fetchJournal();
    fetchDailyMaxValues();
    const intervalId = setInterval(fetchJournal, 2000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    let journalLength = nutritionJournal.journal.length;
    if (journalLength > 0) {
      setCurrentDateIndex(journalLength - 1);
    }
  }, [loading]);

  useEffect(() => {
    const journalLength = nutritionJournal.journal.length;
    setReachedLeft(currentDateIndex === 0);
    setReachedRight(currentDateIndex === journalLength - 1 || journalLength - 1 < 0);
    console.log('hasReachedRight', currentDateIndex, journalLength - 1, currentDateIndex === journalLength - 1);
  }, [currentDateIndex, loading]);

  useEffect(() => {
    calculateDailyTotals(nutritionJournal.journal[currentDateIndex]);
  }, [currentDateIndex, nutritionJournal]);

  const handlePreviousDate = () => {
    if (currentDateIndex > 0) {
      setCurrentDateIndex(currentDateIndex - 1);
    }
  };

  const handleNextDate = () => {
    if (currentDateIndex < nutritionJournal.journal.length - 1) {
      setCurrentDateIndex(currentDateIndex + 1);
    }
  };

  const calculateProgress = (sum: number, max: number) => {
    return max > 0 ? sum / max : 0;
  };

  let currentDay = nutritionJournal.journal[currentDateIndex];

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
        <ThemedText>Nic jeszcze nie zjadłeś :(</ThemedText>
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
        <Pressable onPress={handleNextDate} disabled={currentDateIndex === nutritionJournal.journal.length - 1}>
          <Ionicons
            name={reachedRight ? 'caret-forward-circle-outline' : 'caret-forward-circle'}
            size={32}
            color={theme === 'light' ? Colors.light.icon : Colors.dark.icon}
          />
        </Pressable>
      </View>

      <ThemedText style={{marginTop: 10}}>Kcal {dailyCaloriesSum}</ThemedText>
      <View style={{flexDirection: 'row'}}>
        <ThemedText style={{width:'20%', textAlign: 'center'}}>0</ThemedText>
        <ProgressBar
          progress={calculateProgress(dailyCaloriesSum, maxCalories)}
          bgColor = '#D3D3D3'
        />
        <ThemedText style={{width:'20%', textAlign: 'center'}}>{maxCalories}</ThemedText>
      </View>

      <ThemedText style={{marginTop: 10}}>Białka {dailyProteinsSum}</ThemedText>
      <View style={{flexDirection: 'row'}}>
        <ThemedText style={{width:'20%', textAlign: 'center'}}>0</ThemedText>
        <ProgressBar
          progress={calculateProgress(dailyProteinsSum, maxProteins)}
          bgColor = '#9370DB'
        />
        <ThemedText style={{width:'20%', textAlign: 'center'}}>{maxProteins}</ThemedText>
      </View>

      <ThemedText style={{marginTop: 10}}>Tłuszcze {dailyFatSum}</ThemedText>
      <View style={{flexDirection: 'row'}}>
        <ThemedText style={{width:'20%', textAlign: 'center'}}>0</ThemedText>
        <ProgressBar
          progress={calculateProgress(dailyFatSum, maxFat)}
          bgColor = '#FFA500'
        />
        <ThemedText style={{width:'20%', textAlign: 'center'}}>{maxFat}</ThemedText>
      </View>

      <ThemedText style={{marginTop: 10}}>Węglowodany {dailyCarbsSum}</ThemedText>
      <View style={{flexDirection: 'row'}}>
        <ThemedText style={{width:'20%', textAlign: 'center'}}>0</ThemedText>
        <ProgressBar
          progress={calculateProgress(dailyCarbsSum, maxCarbs)}
          bgColor = '#90EE90'
        />
        <ThemedText style={{width:'20%', textAlign: 'center'}}>{maxCarbs}</ThemedText>
      </View>

      <View style={styles.journalElementContainer}>
        {currentDay.items.map((item, itemIndex) => (
          <JournalElement
            item={item}
            key={itemIndex}
            onDeleteJournalElement={() => deleteElementJournal(item)}
            showDeleteButton={currentDay.date === todayDate}
          />
        ))}
      </View>
    </View>
  );
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
