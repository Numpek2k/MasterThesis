import {StyleSheet, Text} from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import {Scrollable} from "@/components/Scrollable";
import FastTranslator from "fast-mlkit-translate-text";
import {useState} from "react";

export default function TabTwoScreen() {
  const [translatedText, setTranslatedText] = useState("")


  const translateInput = async (text: string)=> {
    await FastTranslator.prepare({
      source: 'Polish',
      target: 'English',
      downloadIfNeeded: true // set to false if you want to download mannually
    }).then(() => console.log("Language data downloaded"));
    await FastTranslator.translate(text).then(value => setTranslatedText(value))
  }
  return (
    <Scrollable>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Dziennik kalorii</ThemedText>
        <Text>Translated text: {translatedText}</Text>
      </ThemedView>
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
