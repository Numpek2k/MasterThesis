import {StyleSheet} from 'react-native';
import {Scrollable} from "@/components/Scrollable";
import AddingFoodModal from "@/components/caloriesJournal/AddingFoodModal";
import NutritionJournalComponent from "@/components/caloriesJournal/NutritionJournalComponent";
import {useEffect, useState} from 'react';
import {getItemFor, storeData} from "@/helpers/storageHepler";
import * as LocalStorageKeys from "@/constants/localStorageConst";
import {NutritionJournal, nutritionJournalTestData} from "@/interfaces/nutritionJournal";

export default function TabThreeScreen() {
  const [nutritionJournal, setNutritionJournal] = useState<NutritionJournal>({ journal: [] });
  const [loading, setLoading] = useState(true);

  const fetchJournal = async () => {
    try {
      const journalString = await getItemFor(LocalStorageKeys.USER_CALORIES_JOURNAL);
      if (journalString) {
        setNutritionJournal(JSON.parse(journalString));
        // setNutritionJournal(nutritionJournalTestData);
      } else {
        setNutritionJournal({ journal: [] });
      }
    } catch (error) {
      console.error("Error fetching journal data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJournal();
  }, []);

  const updateJournal = async (updatedJournal: NutritionJournal) => {
    setNutritionJournal(updatedJournal);
    await storeData(LocalStorageKeys.USER_CALORIES_JOURNAL, JSON.stringify(updatedJournal));
  };

  return (
    <Scrollable>
      <AddingFoodModal
        nutritionJournal={nutritionJournal}
        updateJournal={updateJournal}
      />
      <NutritionJournalComponent
        nutritionJournal={nutritionJournal}
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
