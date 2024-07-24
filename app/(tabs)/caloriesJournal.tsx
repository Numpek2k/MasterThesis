import {StyleSheet} from 'react-native';
import {Scrollable} from "@/components/Scrollable";
import AddingFoodModal from "@/components/caloriesJournal/AddingFoodModal";
import NutritionJournalComponent from "@/components/caloriesJournal/NutritionJournalComponent";

export default function TabTwoScreen() {


    return (
    <Scrollable>
      <AddingFoodModal></AddingFoodModal>
      <NutritionJournalComponent></NutritionJournalComponent>
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
