import {StyleSheet} from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import {Scrollable} from "@/components/Scrollable";
import AddingFoodModal from "@/components/caloriesJournal/addingFoodModal";

export default function TabTwoScreen() {


    return (
    <Scrollable>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Dziennik kalorii</ThemedText>
      </ThemedView>
      <AddingFoodModal></AddingFoodModal>
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
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  reactLogo: {
    height: '100%',
    width: null,
    aspectRatio: 7000 / 2333, // Maintain the aspect ratio of the image
  }
});
