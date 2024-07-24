import {DimensionValue, StyleSheet, View} from "react-native";

interface ProgressBarProps {
  progress: number;
  bgColor: string;
}

export default function ProgressBar({
  progress,
  bgColor
}: ProgressBarProps){
  const progressBarWidth: DimensionValue = `${Math.min(Math.max(progress, 0), 1) * 100}%`;

  return (
    <View style={styles.container}>
      <View style={[styles.progressBar, { width: progressBarWidth, backgroundColor: bgColor}]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 25,
    width: '60%',
    backgroundColor: '#e0e0e0',
    borderColor: 'grey',
    borderWidth: 4,
    borderStyle: 'solid',
    borderRadius: 13,
    overflow: 'hidden',
    // Add pixel art effect
    // borderWidth: 4,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#76c7c0',
    borderColor: 'grey',
    borderWidth: 2,
    borderStyle: 'solid',
    borderRadius:13
    // Add pixel art effect
    // borderWidth: 2,
  },
});
