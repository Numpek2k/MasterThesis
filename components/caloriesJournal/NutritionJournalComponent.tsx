import {useEffect, useState} from "react";
import {Pressable, StyleSheet, useColorScheme, View} from "react-native";
import {ThemedText} from "@/components/ThemedText";
import {Colors} from "@/constants/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import JournalElement from "@/components/caloriesJournal/JournalElement";
import {NutritionSimpleItem} from "@/interfaces/nutritionInfo";
import ProgressBar from "@/components/ProgressBar";
import {NutritionDay, NutritionJournal, UpdateJournalFunction} from "@/interfaces/nutritionJournal";
import {getItemFor} from "@/helpers/storageHepler";
import * as LocalStorageKeys from "@/constants/localStorageConst";

interface NutritionJournalComponentProps {
  nutritionJournal: NutritionJournal;
  updateJournal: UpdateJournalFunction;
  loading: boolean;
}

export default function NutritionJournalComponent({ nutritionJournal, updateJournal, loading }: NutritionJournalComponentProps) {
  const [currentDateIndex, setCurrentDateIndex] = useState(0);
  const [reachedLeft, setReachedLeft] = useState(true);
  const [reachedRight, setReachedRight] = useState(true);
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
  let currentDay = nutritionJournal.journal[currentDateIndex];

  const calculateDailyTotals = (day: NutritionDay) => {
    if (!day) return;

    const caloriesSum = parseFloat(day.items.reduce((sum: number, item: NutritionSimpleItem) => sum + item.calories, 0).toFixed(1));
    const carbsSum = parseFloat(day.items.reduce((sum: number, item: NutritionSimpleItem) => sum + item.carbohydrates_total_g, 0).toFixed(1));
    const fatSum = parseFloat(day.items.reduce((sum: number, item: NutritionSimpleItem) => sum + item.fat_total_g, 0).toFixed(1));
    const proteinsSum = parseFloat(day.items.reduce((sum: number, item: NutritionSimpleItem) => sum + item.protein_g, 0).toFixed(1));

    setDailyCaloriesSum(caloriesSum);
    setDailyCarbsSum(carbsSum);
    setDailyFatSum(fatSum);
    setDailyProteinsSum(proteinsSum);
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


  const deleteElementJournal = async (itemId: string | undefined) => {
    const existingDayIndex = nutritionJournal.journal.findIndex(day => day.date === todayDate);

    if (existingDayIndex !== -1) {
      const existingDay = { ...nutritionJournal.journal[existingDayIndex] }; // Create a copy of the existing day
      const updatedItems = existingDay.items.filter(journalItem => journalItem.id !== itemId);

      let updatedJournal: NutritionJournal;
      if (updatedItems.length > 0) {
        const updatedDay = { ...existingDay, items: updatedItems };
        updatedJournal = {
          journal: nutritionJournal.journal.map((day, index) =>
            index === existingDayIndex ? updatedDay : day
          )
        };
      } else {
        updatedJournal = {
          journal: nutritionJournal.journal.filter((_, index) => index !== existingDayIndex)
        };
      }
      updateJournal(updatedJournal);

      if (updatedItems.length === 0 && currentDateIndex > 0) {
        setCurrentDateIndex(currentDateIndex - 1);
      }
    }
  };

  useEffect(() => {
    if (!loading && nutritionJournal.journal.length > 0) {
      setCurrentDateIndex(nutritionJournal.journal.length - 1);
    }
  }, [loading, nutritionJournal.journal.length]);

  useEffect(() => {
    const journalLength = nutritionJournal.journal.length;
    setReachedLeft(currentDateIndex === 0);
    setReachedRight(currentDateIndex === journalLength - 1 || journalLength < 0);
  }, [currentDateIndex, nutritionJournal.journal.length]);

  useEffect(() => {
    if (nutritionJournal.journal[currentDateIndex]) {
      calculateDailyTotals(nutritionJournal.journal[currentDateIndex]);
    }
  }, [currentDateIndex, nutritionJournal]);

  useEffect(() => {
    fetchDailyMaxValues()
  }, []);

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

      <ThemedText style={{ marginTop: 10 }}>Kcal {dailyCaloriesSum}</ThemedText>
      <View style={{ flexDirection: 'row' }}>
        <ThemedText style={{ width: '20%', textAlign: 'center' }}>0</ThemedText>
        <ProgressBar
          progress={calculateProgress(dailyCaloriesSum, maxCalories)}
          bgColor='#808080'
        />
        <ThemedText style={{ width: '20%', textAlign: 'center' }}>{maxCalories}</ThemedText>
      </View>

      <ThemedText style={{ marginTop: 10 }}>Białka {dailyProteinsSum}</ThemedText>
      <View style={{ flexDirection: 'row' }}>
        <ThemedText style={{ width: '20%', textAlign: 'center' }}>0</ThemedText>
        <ProgressBar
          progress={calculateProgress(dailyProteinsSum, maxProteins)}
          bgColor='#9370DB'
        />
        <ThemedText style={{ width: '20%', textAlign: 'center' }}>{maxProteins}</ThemedText>
      </View>

      <ThemedText style={{ marginTop: 10 }}>Tłuszcze {dailyFatSum}</ThemedText>
      <View style={{ flexDirection: 'row' }}>
        <ThemedText style={{ width: '20%', textAlign: 'center' }}>0</ThemedText>
        <ProgressBar
          progress={calculateProgress(dailyFatSum, maxFat)}
          bgColor='#FFA500'
        />
        <ThemedText style={{ width: '20%', textAlign: 'center' }}>{maxFat}</ThemedText>
      </View>

      <ThemedText style={{ marginTop: 10 }}>Węglowodany {dailyCarbsSum}</ThemedText>
      <View style={{ flexDirection: 'row' }}>
        <ThemedText style={{ width: '20%', textAlign: 'center' }}>0</ThemedText>
        <ProgressBar
          progress={calculateProgress(dailyCarbsSum, maxCarbs)}
          bgColor='#90EE90'
        />
        <ThemedText style={{ width: '20%', textAlign: 'center' }}>{maxCarbs}</ThemedText>
      </View>

      <View style={styles.journalElementContainer}>
        {currentDay.items.map((item) => (
          <JournalElement
            item={item}
            key={item.id}
            onDeleteJournalElement={() => deleteElementJournal(item.id)}
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
